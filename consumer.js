const amqp = require("amqplib");

const data = require("./data.json");
const queueName = process.argv[2] || "jobsQueue";

connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672"); // connect to rabbitmq
    const channel = await connection.createChannel(); // create a channel
    const assertion = await channel.assertQueue(queueName); // create a queue

    //get the message
    console.log("Waiting for messages in jobsQueue...");
    channel.consume(queueName, (message) => {
      const messageInfo = JSON.parse(message.content.toString());
      const userInfo = data.find((u) => u.id === messageInfo.description);
      if (userInfo) {
        console.log("Message received:", userInfo);

        channel.ack(message); // acknowledge the message
      }
    });
  } catch (error) {
    console.log(error);
  }
}
