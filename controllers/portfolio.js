import { QueryTypes } from "sequelize";
import sequelize from "../config/db/index.js";
import RedisClient from "../config/redis/connection.js";
import fs from "fs";

export const setPortfolio = async () => {
  let temp = fs.readFileSync("portfolio.sql").toString();

  const records = await sequelize.query(temp, {
    type: QueryTypes.SELECT,
  });
  await RedisClient.set("myportfolio", JSON.stringify(records), (err) => {
    if (err) throw err;
  });
};

export const getPortfolio = async () => {
  let portfolio = await RedisClient.get("myportfolio", (err) => {
    if (err) throw err;
  });
  if (portfolio === null) {
    await setPortfolio();
    portfolio = await RedisClient.get("myportfolio", (err) => {
      if (err) throw err;
    });
  }
  return portfolio;
};
