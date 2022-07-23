/* eslint-disable no-unused-vars */
import express from "express";
import dotenv from "dotenv";
import { getReturns } from "../controllers/index.js";
dotenv.config();

var router = express.Router();

router.get("/", async function (req, res) {
  try {
    let result = await getReturns();
      return res.status(200).json({
        "total returns": result,
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
