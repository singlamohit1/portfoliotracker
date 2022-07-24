import Bull from "bull";
import dotenv from "dotenv";
dotenv.config();

class Listener {
  jobQueue = null;
  constructor() {
    this.jobQueue = new Bull("portfolio", {
      redis: {
        port: process.env.REDISPORT,
        host: process.env.REDISHOST,
        password: process.env.REDISPASSWORD,
      },
    });
    this.jobQueue.on("global:completed", (job, result) => {
      console.log("Job Completed: ", job, "Result: ", result);
    });
  }
}

export default new Listener();
