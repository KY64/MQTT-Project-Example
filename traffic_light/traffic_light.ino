#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Network setup
const char* ssid = "Insert WiFi name here";
const char* password = "Insert WiFi password here";
const char* mqtt_server = "Insert MQTT Broker IP/Host here";
int red_LED = D7;
int yellow_LED = D6;
int green_LED = D5;

int red_delay = 5;
int yellow_delay = 3;
int green_delay = 3;
int second = 0;
int led_duration = 0;
char led = 'R', last = 'G';
char control = 'A';

// Setup variable
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0, lastMils = 0;
#define MSG_BUFFER_SIZE  (50)
char msg[MSG_BUFFER_SIZE];
int value = 0;

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

int led_color(char color) {
  switch (color) {
    case 'R': return red_LED;
    case 'Y': return yellow_LED;
    case 'G': return green_LED;
    default: return 0;
  }
}

void send_state() {
  char msg[20];
  sprintf(msg, "%c", led);
  client.publish("traffic/light/current", msg, true);
}

int tick() {
  if (millis() - lastMsg > 1000) {
    lastMsg = millis();
    if (control == 'A') {
      char msg[20];
      sprintf(msg, "%d", led_duration - second);
      client.publish("light/duration", msg);
      send_state();
    }
    return second++;
  }
  return second;
}

int set_duration(byte * payload, unsigned int length) {
  int multiplier = 1;
  int current = 0;
  while (length > 0) {
    char duration = (char)payload[length - 1];
    int num = (int) duration - 48;
    current += num * multiplier;
    multiplier *= 10;
    length--;
  }

  return current;
}

void turnon_led(char current_color, char next_color, unsigned long current_time, int duration) {
  if (led == current_color) {
    led_duration = duration;
    digitalWrite(led_color(current_color), HIGH);
    if (second >= duration) {
      digitalWrite(led_color(current_color), LOW);
      led = next_color;
      second = 0;
    }
  }
}

void blink_led(char current_color, char next_color, unsigned long current_time, int duration) {
  if (second <= duration && led == current_color) {
    led_duration = duration;
    if (current_time - lastMils > 500) {
      lastMils = current_time;
      digitalWrite(led_color(current_color), !digitalRead(led_color(current_color)));
      value++;
    }
    if (value > duration * 2) {
      digitalWrite(led_color(current_color), LOW);
      value = 0;
      led = next_color;
      second = 0;
    }
  }
}

void callback(char* topic, byte * payload, unsigned int length) {
  // Print message
  //  Serial.print("Message arrived [");
  //  Serial.print(topic);
  //  Serial.print("] ");
  //  for (int i = 0; i < length; i++) {
  //    Serial.print((char)payload[i]);
  //  }
  //  Serial.println();
  
  if (strcmp(topic, "light/mode") == 0) {
    if ((char)payload[0] != control) {
      control = (char)payload[0];
      send_state();
      // Reset state
      digitalWrite(yellow_LED, LOW);
      lastMsg = millis();
      value = 0;
      second = 0;
    }
  }

  if (strcmp(topic, "traffic/light/red/duration") == 0) {
    red_delay = set_duration(payload, length);
  } else if (strcmp(topic, "traffic/light/yellow/duration") == 0) {
    yellow_delay = set_duration(payload, length);
  } else if (strcmp(topic, "traffic/light/green/duration") == 0) {
    green_delay = set_duration(payload, length);
  }

  if (control == 'M') {
    if (strcmp(topic, "traffic/light/red") == 0) {
      led = 'R';
    } else if (strcmp(topic, "traffic/light/yellow") == 0) {
      led = 'Y';
    } else if (strcmp(topic, "traffic/light/green") == 0) {
      led = 'G';
    }
    send_state();
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      char str[20];
      Serial.println("connected");
      client.publish("light/mode", "A", true);
      sprintf(str, "%d", red_delay);
      client.publish("traffic/light/red/duration", str, true);
      sprintf(str, "%d", yellow_delay);
      client.publish("traffic/light/yellow/duration", str, true);
      sprintf(str, "%d", green_delay);
      client.publish("traffic/light/green/duration", str, true);
      // ... and resubscribe
      client.subscribe("light/mode");
      client.subscribe("traffic/light/+");
      client.subscribe("traffic/light/+/duration");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(red_LED, OUTPUT);
  pinMode(yellow_LED, OUTPUT);
  pinMode(green_LED, OUTPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  switch (control) {
    case 'A': // Automatic
      turnon_led('G', 'Y', millis(), green_delay);
      blink_led('Y', 'R', millis(), yellow_delay);
      turnon_led('R', 'G', millis(), red_delay);
      break;
    case 'M': // Manual
      if (led == 'Y') {
        digitalWrite(green_LED, LOW);
        digitalWrite(red_LED, LOW);
        blink_led('Y', 'Y', millis(), 100);
      }
      else {
        digitalWrite(red_LED, LOW);
        digitalWrite(yellow_LED, LOW);
        digitalWrite(green_LED, LOW);
        digitalWrite(led_color(led), HIGH);
      }
      break;
    default: {};
  }
  tick();
}
