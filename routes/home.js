import express from "express";
import producer from "../producer.js";

var router = express.Router();
router.get("/", async function (req, res) {
  producer.produce();
  res.send("I am working fine!");
});

export const homeRouter = router;
