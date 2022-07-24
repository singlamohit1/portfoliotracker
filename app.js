import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { initDb } from "./config/db/model.js";
import indexRouter from "./routes/index.js";
import tradeRouter from "./routes/trade.js";
import portfolioRouter from "./routes/portfolio.js";
import cumulativeReturnsRouter from "./routes/returns.js";
const app = express();
initDb();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/trade", tradeRouter);
app.use("/portfolio", portfolioRouter);
app.use("/returns", cumulativeReturnsRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smallcase Clone",
      version: "1.0.0",
      description: "This is a simple portfolio application(smallcase clone)",
      contact: {
        name: "Mohit Singla",
        email: "singlamohit98@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
  },
  apis: ["./src/app.js"],
};

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(process.env.PORT || 8000, () => {
  console.log(`Smallcase listening on port 8000`);
});
