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
  }
  async consume() {
    this.jobQueue.process(async function () {
      await setPortfolio();
      return { result: "Success" };
    });
  }
}

new Consumer().consume();
