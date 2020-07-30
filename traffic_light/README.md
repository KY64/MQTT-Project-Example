# Traffic Light Simulation Using MQTT

<img src="Traffic Light.png" width="600px" />

This is project example of traffic light simulation control using website and Arduino WeMos D1

## Requirements
* Hardware
    * Any Arduino that could use ESP8266
    * Project Board
    * Jumper wires
    * 3pcs LED 5mm
* Software
    * Arduino IDE 1.8+
    * MQTT Broker (Mosquitto, HiveMQ, etc.)

## Installation

### Clone the repository

```
git clone https://github.com/KY64/MQTT-Project-Example.git
```

### Install package

1. Install [PubSubClient](https://www.arduino.cc/reference/en/libraries/pubsubclient/) library from Arduino IDE Library Manager

2. Install [ESP8266 Board](https://github.com/esp8266/Arduino#installing-with-boards-manager) from Arduino IDE Board Manager

### How To Use

1. Run the broker service
2. Change some lines on `.ino` and `HTML` files for network configuration and broker IP/Host
3. Upload the `.ino` files to Arduino
4. Open the HTML file