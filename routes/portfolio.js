import express from "express";
import dotenv from "dotenv";
import { getPortfolio } from "../controllers/index.js";
dotenv.config();

var router = express.Router();

router.get("/", async function (req, res) {
  try {
    let result = await getPortfolio();
    res.send(result);
  } catch (error) {
    res.status(500).send("Unable to get portfolio" + error);
  }
});

export const portfolioRouter = router;
