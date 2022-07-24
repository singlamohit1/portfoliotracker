import { TradeModel, StockModel } from "../config/db/model.js";
import { ErrorException } from "../utils/errorHandler.js";
import { ErrorCode } from "../constants/errorCode.js";
import { checkIfSufficientQuantity } from "./index.js";
import { getTradeFromTradeId, checkTradeReversal } from "./index.js";

export const addTradeinDb = async (trade) => {
  //If a trade is of type "sold" check If sufficient quantity is there to sell
  if (trade.type == "SELL") {
    let result = await checkIfSufficientQuantity(trade);

    if (!result) {
      throw new ErrorException(
        ErrorCode.NotFound,
        "Trade addition failed: Not enough quantity available in your portfolio to sell!"
      );
    }
  }
  await TradeModel.create(trade);
};

export const getTrades = async () => {
  // let p =await StockModel.findAll({  include: {
  //   model: TradeModel,
  // },raw: true});
  let p = await StockModel.findAll({
    include: {
      model: TradeModel,
    },
  });

  // let p =await StockModel.findAll({
  // group: ['StockModel.id'],include: {
  //   model: TradeModel,
  // },raw: true});
  return p;
};

export const updateTrade = async (id, updatedTrade) => {
  const correspondingTrade = await getTradeFromTradeId(id);
  const ifTradeReversalPossible = await checkTradeReversal(
    id,
    correspondingTrade,
    updatedTrade
  );
  if (!ifTradeReversalPossible) {
    throw new ErrorException(
      ErrorCode.NotFound,
      "Trade updation not possible since trade you are trying to update is not feasible with your trade history!"
    );
  }
  let results = await TradeModel.update(updatedTrade, { where: { id } });
  return results[0];
};

export const deleteTrade = async (id) => {
  const stock = await getTradeFromTradeId(id);
  const test = {
    quantity: 0,
    price: 0,
    type: "SELL",
    stockId: stock.stockId,
  };
  const ifTradeReversalPossible = await checkTradeReversal(id, stock, test);
  if (!ifTradeReversalPossible) {
    throw new ErrorException(
      ErrorCode.NotFound,
      "Trade deletion not possible since trade you are trying to update is not feasible with your trade history!"
    );
  }
  let result = await TradeModel.destroy({ where: { id } });
  return result;
};
