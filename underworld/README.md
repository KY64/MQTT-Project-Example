# Broadcasting Message with MQTT

<img src="public/Underworld.png" width="600px" />

This is an example of broadcasting message using MQTT with NextJS

## Requirements
* NodeJS v12.0+
* [Yarn](https://yarnpkg.com/getting-started/install) v1.20+
* MQTT Broker (Mosquitto, HiveMQ, etc.)

## Installation

### Clone the repository

```
git clone https://github.com/KY64/MQTT-Project-Example.git
```

### Install package

```
cd underworld
yarn install
```

## How To Use

### Run the broker

> In this case, I use Mosquitto broker

```
service mosquitto start
```

### Run local server

```
yarn dev
```

### Open browser

Enter `localhost:3000` to view the webpage

### Open admin page

Go to **underworld_admin** folder then open the HTML page