import express from "express";
import dotenv from "dotenv";
import {
  reqBodyValidation,
  tradeIdValidation,
} from "../middleware/validation.js";
import producer from "../producer.js";

import {
  addTradeinDb,
  deleteTrade,
  updateTrade,
  getTrades,
} from "../controllers/index.js";
dotenv.config();

var router = express.Router();

router.post("/", reqBodyValidation, async function (req, res) {
  try {
    await addTradeinDb(req.body);
    producer.produce();
    res.send("Success");
  } catch (error) {
    return res.status(500).send({ message: error.metaData });
  }
});

router.get("/", async function (req, res) {
  try {
    let result = await getTrades();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put(
  "/:tradeId",
  tradeIdValidation,
  reqBodyValidation,
  async function (req, res) {
    try {
      let result = await updateTrade(req.params.tradeId, req.body);
      if (result) {
        producer.produce();
        return res.json("Success");
      }
      return res.status(500).send("Error in updating the trade");
    } catch (error) {
      return res
        .status(error.status ? error.status : 500)
        .send({ message: error.metaData });
    }
  }
);

router.delete("/:tradeId", tradeIdValidation, async function (req, res) {
  try {
    let ans = await deleteTrade(req.params.tradeId);
    if (ans) {
      producer.produce();
      res.json("success");
    } else return res.status(400).send("Error in deleting the trade");
  } catch (error) {
    res.status(500).send(error);
  }
});

export const tradeRouter = router;
