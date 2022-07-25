import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(
  process.env.DBDATABASE,
  process.env.DBUSER,
  process.env.DBPASSWORD,
  {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: "postgres",
    logging: false,
    dialectOptions:
      process.env.ENVIRONMENT !== "develop"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
  }
);

export const initDb = async () => {
  await sequelize.sync();
  console.log("Database connected!");
};

export default sequelize;
