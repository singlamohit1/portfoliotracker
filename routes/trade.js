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

router.get("/", async function (req, res) {
  try {
    let result = await getTrades();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", reqBodyValidation, async function (req, res) {
  try {
    await addTradeinDb(req.body);
    producer.produce();
    res.send("Success");
  } catch (error) {
    console.log("in catch", error);
    console.log("error is ", error);
    console.log("t is ", error.error);
    // res.status(500)
    // res.json({ error: error })
    // return res.render('error', { error })
    // next(error);
    return res.status(500).send({ message: error.metaData });
  }
});

router.put(
  "/:tradeId",
  tradeIdValidation,
  reqBodyValidation,
  async function (req, res) {
    try {
      console.log("inside put controller");
      let result = await updateTrade(req.params.tradeId, req.body);
      console.log("result is ", result);
      if (result) {
        producer.produce();
        return res.json("Success");
      }
      return res.status(500).send("Error in updating the trade");
    } catch (error) {
      console.log("errrr", error, typeof error);
      console.log("rrrr", Object.keys(error));
      console.log("values", Object.values(error));
      console.log("stringify", JSON.stringify(error, null, 4));
      console.log("err.error", error.Error);
      console.log("error.status is ", error.status);
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

export default router;
