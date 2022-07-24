import { QueryTypes } from "sequelize";
import sequelize from "../config/db/index.js";
import RedisClient from "../config/redis/connection.js";
import fs from "fs";

export const setPortfolio = async () => {
  console.log("called");
  let temp = fs.readFileSync("portfolio.sql").toString();

  const records = await sequelize.query(temp, {
    type: QueryTypes.SELECT,
  });
  console.log("records,", records);
  RedisClient.set("myportfolio", JSON.stringify(records), (err, res) => {
    if (err) throw err;
  });
};

export const getPortfolio = async () => {
  console.log("get portoflio clled");
  let portfolio = await RedisClient.get("myportfolio", (err, res) => {
    if (err) throw err;
  });
  if (portfolio === null) {
    await setPortfolio();
    portfolio = await RedisClient.get("myportfolio", (err, res) => {
      if (err) throw err;
    });
  }
  return portfolio;
};
