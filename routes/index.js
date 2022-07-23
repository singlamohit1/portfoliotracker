/* eslint-disable no-unused-vars */
import express from "express";
import producer from "../producer.js";
var router = express.Router();
router.get("/", async function (req, res, next) {
  console.log("yip");
  console.log("producer is ", producer);
  producer.produce();
  res.send("I am working fine!");
});

export default router;
