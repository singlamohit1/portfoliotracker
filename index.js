/* eslint-disable no-unused-vars */
import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { initDb } from "./config/db/model.js";
import indexRouter from "./routes/index.js";
import tradeRouter from "./routes/trade.js";
import portfolioRouter from "./routes/portfolio.js";
import cumulativeReturnsRouter from "./routes/returns.js";
import { errorHandler } from "./middleware/validation.js";
const app = express();
initDb();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(errorHandler);
// app.use(function (err, req, res, next) {
//   console.log("errrr is ", err);
//   res.status(err.status || 500);
//   res.json({ error: err });
// });

app.use("/", indexRouter);
app.use("/trade", tradeRouter);
app.use("/portfolio", portfolioRouter);
app.use("/returns", cumulativeReturnsRouter);
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.listen(8000, () => {
  console.log(`Smallcase listening on port 8000`);
});
