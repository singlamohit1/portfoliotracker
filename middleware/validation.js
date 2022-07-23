import joi from "joi";
import {
  getAllStockIdsAvailable,
  getAllTradeIdsAvailable,
} from "../controllers/index.js";

export const reqBodyValidation = async (req, res, next) => {
  console.log("inside validation");
  const tradeIds = await getAllStockIdsAvailable();
  console.log("tradeIds is ", tradeIds);
  console.log("t is ", typeof tradeIds[0]);
  const isValidTradeId = (id) => {
    console.log("id is ", id, typeof id);
    if (!tradeIds.includes(parseInt(id))) {
      throw new Error("Stock doesn't exist");
    }
  };

  const validation = joi.object({
    type: joi.string().valid("BUY", "SELL"),
    quantity: joi.number().integer().min(1).required(),
    price: joi.number().integer().min(1).required(),
    stockId: joi.string().custom(isValidTradeId).required(),
  });

  const { error } = validation.validate(req.body);
  if (error) {
    return res.status(406).send(`Error in request body : ${error.message}`);
  } else {
    next();
  }
};

export const tradeIdValidation = async (req, res, next) => {
  console.log("inside validation3");
  const tradeIds = await getAllTradeIdsAvailable();
  let cc = req.params.tradeId;
  if (!tradeIds.includes(parseInt(cc))) {
    return res.status(406).send(`Invalid tradeId`);
  } else {
    next();
  }
};
