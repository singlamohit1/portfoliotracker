/* eslint-disable no-undef */
import redis from "redis";
import dotenv from "dotenv";
dotenv.config();

class Redis {
  static async connect() {
    let client = null;
    try {
      client = redis.createClient({
        socket: {
          host: process.env.REDISHOST,
          port: process.env.REDISPORT,
        },
        password: process.env.REDISPASSWORD,
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
