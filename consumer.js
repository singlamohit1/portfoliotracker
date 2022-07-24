import Bull from "bull";
import { setPortfolio } from "./controllers/index.js";
import dotenv from "dotenv";
dotenv.config();

class Consumer {
  jobQueue = null;
  constructor() {
    this.jobQueue = new Bull("portfolio", {
      redis: {
        port: process.env.REDISPORT,
        host: process.env.REDISHOST,
        password: process.env.REDISPASSWORD,
      },
    });
    console.log("this.jobQueue is ", this.jobQueue);
  }
  async consume() {
    console.log("will consume");
    this.jobQueue.process(async function () {
      console.log("just now");
      await setPortfolio();
      return { result: "Success" };
    });
  }
}

new Consumer().consume();
