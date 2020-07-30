let img_bg = document.getElementById('image-bg'),
    img = document.getElementById('image'),
    name = document.getElementById('name'),
    contract = document.getElementById('contract')

const mqtt_host = 'test.mosquitto.org',
      mqtt_port = 8081,
      clientID = `clientID#${Math.floor(Math.random() * 100000)}`

let mqtt = new Paho.MQTT.Client(mqtt_host, mqtt_port, clientID)
let {connect} = mqtt

var client, source

const onConnected = () => {
  console.log('connected')
  client = mqtt
}

const onFail = () => {
  console.error('failed!')
}

connect({onSuccess: onConnected, onFailure: onFail})    

const currency = () => {
    if (contract.value.split('$').length == 1 && contract.value.length > 0) {
        contract.value = '$' + contract.value
    }
}

const load_image = e => {
    let file = new FileReader(),
        buffer = new FileReader()
    buffer.readAsArrayBuffer(e.target.files[0])
    // file.readAsDataURL(e.target.files[0])
    // file.onload = () => {
    //     img.src = file.result
    // }
    buffer.onload = () => {
        let f = new FileReader()
        let bl = new Blob([new Uint8Array(buffer.result)], {type:'image/jpg'})
        f.readAsDataURL(bl)
        f.onload = () => {
            img.src = f.result
        }
        source = buffer.result
    }
}

const publish = () => {
    client.send('contract/name', name.value, 1, true)
    client.send('contract/value', contract.value, 1, true)
    client.send('contract/img', source, 1, true)
}