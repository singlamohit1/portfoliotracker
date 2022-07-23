// /* eslint-disable no-unused-vars */
import redis from "redis";

class Redis {
  static async connect() {
    let client = null;
    try {
      client = redis.createClient({
        socket: {
          host: "localhost",
          port: 6379,
        },
        password: "",
      });
      await client.connect();
      console.log("redis connected successfully");
      return client;
    } catch (err) {
      console.error(err);
    }
    return client;
  }
}

const connection = await Redis.connect();
export default connection;
