import joi from "joi";
import {
  getAllStockIdsAvailable,
  getAllTradeIdsAvailable,
} from "../controllers/index.js";

// validate req body on update and delete
export const reqBodyValidation = async (req, res, next) => {
  const tradeIds = await getAllStockIdsAvailable();
  const isValidTradeId = (id) => {
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

// validate if trade id is correct
export const tradeIdValidation = async (req, res, next) => {
  const tradeIds = await getAllTradeIdsAvailable();
  let tradeId = req.params.tradeId;
  if (!tradeIds.includes(parseInt(tradeId))) {
    return res.status(406).send(`Invalid tradeId`);
  } else {
    next();
  }
};
