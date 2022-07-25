import { QueryTypes } from "sequelize";
import sequelize from "../config/db/index.js";
import RedisClient from "../config/redis/connection.js";
import fs from "fs";
import { ErrorException } from "../utils/errorHandler.js";
import { ErrorCode } from "../constants/errorCode.js";

export const setPortfolio = async () => {
  try {
    let portfolioQuery = fs.readFileSync("portfolio.sql").toString();
    const records = await sequelize.query(portfolioQuery, {
      type: QueryTypes.SELECT,
    });
    await RedisClient.set("mineportfolio", JSON.stringify(records), (err) => {
      if (err) throw err;
    });
  } catch (error) {
    throw new ErrorException(ErrorCode.UnknownError, error);
  }
};

export const getPortfolio = async () => {
  try {
    let portfolio = await RedisClient.get("mineportfolio", (err) => {
      if (err) throw err;
    });
    if (portfolio === null) {
      await setPortfolio();
      portfolio = await RedisClient.get("mineportfolio", (err) => {
        if (err) throw err;
      });
    }
    return portfolio;
  } catch (error) {
    throw new ErrorException(ErrorCode.UnknownError, error);
  }
};
