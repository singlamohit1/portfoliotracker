import Bull from "bull";

class Producer {
  jobQueue = null;
  constructor() {
    this.jobQueue = new Bull("set-portfolio");
  }

  async produce() {
    console.log("produce called");
    await this.jobQueue.add();
  }
}

export default new Producer();
