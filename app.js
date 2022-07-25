import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { initDb } from "./config/db/index.js";
import {
  cumulativeReturnsRouter,
  homeRouter,
  tradeRouter,
  portfolioRouter,
} from "./routes/index.js";

const app = express();
initDb();
dotenv.config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", homeRouter);
app.use("/trade", tradeRouter);
app.use("/portfolio", portfolioRouter);
app.use("/returns", cumulativeReturnsRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trading App",
      version: "1.0.0",
      description: "This is a trading application",
      contact: {
        name: "Mohit Singla",
        email: "singlamohit98@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.SERVERURL,
      },
    ],
  },
  apis: ["./src/app.js"],
};

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(process.env.PORT || 8000, () => {
  console.log(`App listening on port`, process.env.PORT || 8000);
});
