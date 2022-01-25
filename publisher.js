const amqp = require("amqplib");

const message = {
  description: "This is a test message",
};

const data = require("./data.json");

const queueName = process.argv[2] || jobsQueue;
connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672"); // connect to rabbitmq
    const channel = await connection.createChannel(); // create a channel
    const assertion = await channel.assertQueue(queueName); // create a queue

    data.forEach((i) => {
      message.description = i.id;
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message))); // send message to queue
      console.log("Message sent to queue", i.id);
    });

    //Interval
    /* setInterval(() => {
      message.description = new Date().getTime();

      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message))); // send message to queue
      console.log("Message sent to queue", message);  
    }, 500); */
  } catch (error) {
    console.log(error);
  }
}
