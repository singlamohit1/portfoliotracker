/* eslint-disable no-undef */
import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(
  process.env.Database,
  process.env.User,
  process.env.Password,
  {
    host: process.env.Host,
    port: process.env.Port,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default sequelize;
