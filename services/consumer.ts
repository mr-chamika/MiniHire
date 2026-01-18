import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "notification-service",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "notification-group" });

export async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: "first-topic" });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = message.value && message.value.toString();
            //const data = message.value && JSON.parse(message.value.toString());
            console.log("📩 Event received:", data);
        },
    });
}

const run = async () => {
    await startConsumer();
};

run();