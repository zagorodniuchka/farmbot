import mqtt from "mqtt";
export function connectToFarmBot(token, botId, email, onMessageCallback) {
    const options = {
        username: email,
        password: token,
        protocol: "wss",
        clientId: `farmbot_client_${botId}_${Math.floor(Math.random() * 10000)}`,
    };
    const client = mqtt.connect("wss://clever-octopus.rmq.cloudamqp.com:443/ws/mqtt", options);

    client.on("connect", () => {
        console.log("🚀 Connected to FarmBot via MQTT");
        client.subscribe(`bot/${botId}/status`);
    });

    client.on("message", (topic, message) => {
        console.log("💬", topic, message.toString());
        onMessageCallback?.(topic, message.toString());
    });

    client.on("error", (err) => {
        console.error("❌ MQTT error:", err);
    });

    return client;
}
