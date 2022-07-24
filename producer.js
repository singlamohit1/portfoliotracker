import Bull from "bull";
import dotenv from "dotenv";
dotenv.config();

class Producer {
  jobQueue = null;
  constructor() {
    this.jobQueue = new Bull("portfolio", {
      redis: {
        port: process.env.REDISPORT,
        host: process.env.REDISHOST,
        password: process.env.REDISPASSWORD,
      },
    });
  }

  async produce() {
    console.log("will produce");
    await this.jobQueue.add();
  }
}

export default new Producer();
