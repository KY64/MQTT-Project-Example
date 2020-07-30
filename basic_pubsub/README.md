# Basic Publish Subscribe

This is a simple example for publish and subscribe MQTT client using NodeJS

## Requirements
* NodeJS v12.0+
* MQTT Broker (Mosquitto, HiveMQ, etc.)

## Installation

### Clone the repository

```
git clone https://github.com/KY64/MQTT-Project-Example.git
```

### Install package

```
npm i
```

## How To Use

### Run the broker service
> In this case, I use _Mosquitto_ as broker

```
service mosquitto start
```

### Run publisher

```
node publisher.js
```

### Run subscriber

```
node subscriber.js
```