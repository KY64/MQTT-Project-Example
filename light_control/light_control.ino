#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Network setup
const char* ssid = "Insert WiFi name here";
const char* password = "Insert WiFi password here";
const char* mqtt_server = "Insert MQTT broker IP/Host here";
int red_LED = D7;
int yellow_LED = D6;
int green_LED = D5;

// Setup variable
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
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

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == 'R') {
    digitalWrite(red_LED, !digitalRead(red_LED));   // Turn the LED on (Note that LOW is the voltage level
    Serial.print("Red LED is ");
    Serial.println(!digitalRead(red_LED));
    client.publish("led/status/red", !digitalRead(red_LED) ? "0" : "1", true);
  }
  if ((char)payload[0] == 'Y') {
    digitalWrite(yellow_LED, !digitalRead(yellow_LED));   // Turn the LED on (Note that LOW is the voltage level
    Serial.print("Yellow LED is ");
    Serial.println(!digitalRead(yellow_LED));
    client.publish("led/status/yellow", !digitalRead(yellow_LED) ? "0" : "1", true);
  }  
  if ((char)payload[0] == 'G') {
    digitalWrite(green_LED, !digitalRead(green_LED));   // Turn the LED on (Note that LOW is the voltage level
    Serial.print("Green LED is ");
    Serial.println(!digitalRead(green_LED));
    client.publish("led/status/green", !digitalRead(green_LED) ? "0" : "1", true);
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
      Serial.println("connected");
      // publish current LED status
      client.publish("led/status/red", !digitalRead(red_LED) ? "0" : "1", true);
      client.publish("led/status/yellow", !digitalRead(yellow_LED) ? "0" : "1", true);
      client.publish("led/status/green", !digitalRead(green_LED) ? "0" : "1", true);
      // ... and resubscribe
      client.subscribe("test/rgy/led");
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
  pinMode(red_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  pinMode(yellow_LED, OUTPUT);
  pinMode(green_LED, OUTPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  digitalWrite(red_LED, 1);
  digitalWrite(yellow_LED, 1);
  digitalWrite(green_LED, 1);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
