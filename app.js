import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { initDb } from "./config/db/index.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger.json");

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

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || 8000, () => {
  console.log(`App listening on port`, process.env.PORT || 8000);
});
