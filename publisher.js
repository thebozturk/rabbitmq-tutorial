const amqp = require("amqplib");

const message = {
  description: "This is a test message",
};

connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672"); // connect to rabbitmq
    const channel = await connection.createChannel(); // create a channel
    const assertion = await channel.assertQueue("jobsQueue"); // create a queue

    channel.sendToQueue("jobsQueue", Buffer.from(JSON.stringify(message))); // send message to queue
    console.log("Message sent to queue", message);
  } catch (error) {
    console.log(error);
  }
}
