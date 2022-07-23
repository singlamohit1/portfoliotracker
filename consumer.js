import Bull from "bull";
import { setportfolio } from "./controllers/index.js";
import dotenv from "dotenv";
dotenv.config();

class Consumer {
  jobQueue = null;
  constructor() {
    this.jobQueue = new Bull("set-portfolio",{
      redis:{port:process.env.REDISPORT,host:process.env.REDISHOST,password:process.env.REDISPASSWORD}
    });

  }
  async consume() {
    this.jobQueue.process(async function () {
      console.log("in consumer got");
      await setportfolio();
      return { result: "Success" };
    });
  }
}

new Consumer().consume();
