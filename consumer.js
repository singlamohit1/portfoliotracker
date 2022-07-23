import Bull from "bull";
import { setportfolio } from "./controllers/index.js";

class Consumer {
  jobQueue = null;
  constructor() {
    this.jobQueue = new Bull("set-portfolio");
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
