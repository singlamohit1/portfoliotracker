import Bull from "bull";

class Listener {
  jobQueue = null;
  constructor() {
    this.jobQueue = new Bull("set-portfolio");
    this.jobQueue.on("global:completed", (job, result) => {
      console.log("Job Completed: ", job, "Result: ", result);
    });
  }
}

export default new Listener();
