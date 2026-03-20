import 'dotenv/config';
import { Database } from "../db";
import { Notification } from "@/models/Notifications";
import { Kafka } from "kafkajs";
import { io } from "./socket"


const kafka = new Kafka({
    clientId: "notification-service-hire",
    brokers: ["127.0.0.1:9092"],
});

const consumer = kafka.consumer({ groupId: "notification-group-hire" });

export async function startConsumer() {

    await Database();
    await consumer.connect();
    await consumer.subscribe({ topic: "hire-fromCompany" });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = message.value && message.value.toString();
            //const data = message.value && JSON.parse(message.value.toString());
            console.log(`📩 Event from ${topic}:, ${data} and partition:${partition}`);

            if (topic === "hire-fromCompany") {//consume from kafka broker
                const hireData = data && JSON.parse(data);
                const { studentId, companyName, role, email, companyId } = hireData;

                const notification = new Notification({//saving notification to db
                    studentId,
                    companyId,
                    message: `Congratulations! You have been hired for the role of ${role} by ${companyName}.`,
                    type: 'hire',
                    companyName,
                    role,
                    email
                });
                await notification.save();

                io.to(studentId).emit('hire-alert', {//send notification to room(frontend)
                    _id: notification._id,
                    message: notification.message,
                    type: notification.type,
                    companyName,
                    role
                });
            }

        },
    });
}

const run = async () => {
    await startConsumer();
};

run();