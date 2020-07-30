// Documentation: https://www.eclipse.org/paho/clients/js/

// Setup
const mqtt_host = 'localhost'
const mqtt_port = 9001 // use websocket port from broker
const clientID = `clientID#${Math.floor(Math.random() * 100000)}`

let redBtn = document.getElementById('red-led'),
    yellowBtn = document.getElementById('yellow-led'),
    greenBtn = document.getElementById('green-led'),
    log = document.getElementById('log')

// Initiate MQTT object
let mqtt = new Paho.MQTT.Client(mqtt_host, mqtt_port, clientID)
let {connect} = mqtt
var client

const onConnect = () => {
    log.innerHTML += `<code>Connected!</code>`

    // Set variable to global
    client = mqtt
    // Subscribe to topic
    client.subscribe('led/status/+')
}

const onFail = (err) => {
    log.innerHTML += `<code style="color:red">${err.errorMessage}</code>`
    log.scrollTop = log.scrollHeight
    
}

// Callback when connecting to broker
connect({onSuccess:onConnect, onFailure:onFail, useSSL:true})


const red_led = () => client.send('test/rgy/led', 'R') // Publish
const yellow_led = () => client.send('test/rgy/led', 'Y') // Publish
const green_led = () => client.send('test/rgy/led', 'G') // Publish

// Receive message
mqtt.onMessageArrived = (msg) => {
    log.scrollTop = log.scrollHeight
    switch(msg.destinationName.split('/')[2]) {
        case 'red'   : redBtn.checked = msg.payloadString == '1' ? true:false;
                       log.innerHTML += `<code>Red ${msg.payloadString}</code>`;
                       break;
        case 'yellow': yellowBtn.checked = msg.payloadString == '1' ? true:false;
                       log.innerHTML += `<code>Yellow ${msg.payloadString}</code>`;
                       break;
        case 'green' : greenBtn.checked = msg.payloadString == '1' ? true:false;
                       log.innerHTML += `<code>Green ${msg.payloadString}</code>`;
                       break;
        default:
            {}
    }
}

mqtt.onConnectionLost = () => log.innerHTML += '<code style="color:red">Connection Lost!</code>'