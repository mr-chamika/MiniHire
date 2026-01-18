import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
    clientId: "minihire",
    brokers: ["localhost:9092"],
});

let producer: Producer | undefined;

export async function getProducer() {
    if (!producer) {
        producer = kafka.producer();
        await producer.connect();
    }
    return producer;
}

const run = async () => {

    try {

        const producer = await getProducer();

        await producer.send({

            topic: 'first-topic',
            messages: [

                { value: 'hello i am minihire' },
                //{ value: JSON.stringify({ message: 'hello i am minihire' }) }

            ]

        })

    } catch (err) {

        console.log(err);

    }




}

run();