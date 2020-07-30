import Layout from "../components/layout";
import Image from "../components/images";
import * as mqtt from "mqtt";
import { useState, useEffect } from "react";

const mqtt_host = process.env.MQTT_HOST || "test.mosquitto.org",
  mqtt_port = process.env.MQTT_PORT || "8081",
  client = mqtt.connect(`wss://${mqtt_host}:${mqtt_port}`, {});

client.on("connect", () => {
  console.log("connected");
  client.subscribe("contract/name");
  client.subscribe("contract/value");
  client.subscribe("contract/img");
});
export default () => {
  const [img, setImg] = useState("");
  const [name, setName] = useState("Unknown");
  const [value, setValue] = useState("$0");

  useEffect(() => {
    client.on("message", (topic, msg) => {
      switch (topic) {
        case "contract/name":
          setName(msg.toString());
          break;
        case "contract/value":
          setValue(msg.toString());
          break;
        case "contract/img":
          let data = new Blob([new Uint8Array(msg.buffer)], {
              type: "image/jpg",
            }),
            file = new FileReader();
          file.readAsDataURL(data);
          file.onload = () => {
            setImg(file.result);
          };
          break;
        default: {
        }
      }
    });
  }, []);

  return (
    <Layout>
      <div style={{ textAlign: "center", marginTop: "5em" }}>
        <Image source={img} w="170px" h="170px" />
        <h3 style={{ marginBottom: "0" }}>{name}</h3>
        <h1
          style={{
            margin: "0 0 20px 0",
            fontWeight: 400,
            letterSpacing: 3,
          }}
        >
          {value}
        </h1>
      </div>
    </Layout>
  );
};
