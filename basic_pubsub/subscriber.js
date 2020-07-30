// Initialize connection
const mqtt = require('mqtt'),
      client = mqtt.connect('mqtt://localhost:1883')

// When connected to broker
client.on('connect', () => {
    console.log('connected!')

    client.subscribe('test/topic')
    client.publish('test/topic', 'Hello from Subscriber!')
})

// When reconnecting to broker
client.on('reconnect', () => console.log('reconnecting . . .'))
// When there is no connection
client.on('offline', () => console.log('offline'))
// When connection is closed
client.on('close', () => console.log('closed'))
// When error occurs
client.on('error', err => console.error(err.errno))
// When a message received
client.on('message', (topic,msg,packet) => {
    console.log(topic,'\n')
    console.log(msg.toString(),'\n')
})