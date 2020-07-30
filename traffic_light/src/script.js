// Documentation: https://www.eclipse.org/paho/clients/js/

// Network setup
const mqtt_host = 'localhost'
const mqtt_port = 9001 // use websocket port from broker
const clientID = `clientID#${Math.floor(Math.random() * 100000)}`

// Get elements ID
let red_btn = document.getElementById('red-control'),
    yellow_btn = document.getElementById('yellow-control'),
    green_btn = document.getElementById('green-control'),
    red_led = document.getElementById('red-led'),
    yellow_led = document.getElementById('yellow-led'),
    green_led = document.getElementById('green-led'),
    auto_mode = document.getElementById('switch-mode'),
    red_duration = document.getElementById('red-duration'),
    yellow_duration = document.getElementById('yellow-duration'),
    green_duration = document.getElementById('green-duration'),
    outer_background = document.getElementById('outer-background'),
    inner_background = document.getElementById('inner-background'),
    tick = document.getElementById('tick')

// Initialize MQTT object
let mqtt = new Paho.MQTT.Client(mqtt_host, mqtt_port, clientID)
let {connect} = mqtt
var client, led_state

// When connected to broker
const onConnect = () => {
    console.log('connected')

    client = mqtt
    client.subscribe('light/mode')
    client.subscribe('light/duration')
    client.subscribe('traffic/light/+')
    client.subscribe('traffic/light/+/duration')
}

// When failed to connect
const onFail = err => {
    console.error(err)
}

// When receive a message
mqtt.onMessageArrived = msg => {
    switch(msg.destinationName) {
        case 'light/duration':
            tick.innerText = msg.payloadString            
            break
        case 'light/mode':
            auto_mode.checked = msg.payloadString == 'A'
            red_duration.readOnly = !auto_mode.checked
            yellow_duration.readOnly = !auto_mode.checked
            green_duration.readOnly = !auto_mode.checked
            break
        case 'traffic/light/current':
            led_state = msg.payloadString
            change_background(outer_background, background_color(msg.payloadString)[1])
            change_background(inner_background, background_color(msg.payloadString)[0])
            auto_mode.checked ? disable_control(false) : disable_control(msg.payloadString)            
            break;
        case 'traffic/light/red/duration':
            red_duration.value = msg.payloadString
            break;
        case 'traffic/light/yellow/duration':
            yellow_duration.value = msg.payloadString
            break;
        case 'traffic/light/green/duration':
            green_duration.value = msg.payloadString
            break;
        default: {};
    }
}

// When lost connection
mqtt.onConnectionLost = () => {
    alert('Connection lost')
    console.error('Connection lost')
}

// Connect to broker
connect({onSuccess:onConnect, onFailure:onFail})

const switch_mode = () => {
    let state = auto_mode.checked ? 'A' : 'M'
    client.send('light/mode', state, 1, true)
}

const set_duration = (color, duration) => {
    if (auto_mode.checked)
        client.send(`traffic/light/${color}/duration`, duration, 1, true)
    else
        client.send(`traffic/light/${color}`, duration, 1, true)
}

const change_background = (element, color) => element.style = `background: ${color}`

const disable_control = color => {    
    red_led.classList.add('disable')
    yellow_led.classList.add('disable')
    green_led.classList.add('disable')

    switch(color) {
        case 'R':
            return red_led.classList.remove('disable')
        case 'Y':
            return yellow_led.classList.remove('disable')
        case 'G':
            return green_led.classList.remove('disable')
        default:
            red_led.classList.remove('disable')
            yellow_led.classList.remove('disable')
            green_led.classList.remove('disable')
    }
}

const background_color = color => {
    switch(color) {
        case 'R':
            return ['#FBAAAA','#FFDADA']
        case 'Y':
            return ['#FFD884', '#FDEABF']
        case 'G':
            return ['#B2FBAA', '#DAFFDC']
        default:
            return ['#9E9E9E','#DFDFDF']
    }
}

red_btn.addEventListener('click', e => set_duration('red', red_duration.value))
yellow_btn.addEventListener('click', e => set_duration('yellow', yellow_duration.value))
green_btn.addEventListener('click', e => set_duration('green', green_duration.value))