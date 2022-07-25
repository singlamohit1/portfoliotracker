import { TradeModel, StockModel } from "../config/db/model.js";
import { ErrorException } from "../utils/errorHandler.js";
import { ErrorCode } from "../constants/errorCode.js";
import { checkIfSufficientQuantity } from "./index.js";
import { getTradeFromTradeId, checkTradeReversal } from "./index.js";

export const addTrade = async (trade) => {
  try {
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
  } catch (error) {
    throw new ErrorException(ErrorCode.UnknownError, error);
  }
};

// returns all stocks and their corresponding trades
export const getTrades = async () => {
  try {
    let trades = await StockModel.findAll({
      include: {
        model: TradeModel,
      },
    });
    return trades;
  } catch (error) {
    throw new ErrorException(ErrorCode.UnknownError, error);
  }
};

export const updateTrade = async (id, updatedTrade) => {
  try {
    const correspondingTrade = await getTradeFromTradeId(id);
    // check If updating the trade is feasibile with history
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
  } catch (error) {
    throw new ErrorException(ErrorCode.UnknownError, error);
  }
};

export const deleteTrade = async (id) => {
  try {
    const stock = await getTradeFromTradeId(id);
    // deleting a trade is similar to changing number of shares in that trade to 0
    const sampleTrade = {
      quantity: 0,
      price: 0,
      type: "SELL",
      stockId: stock.stockId,
    };
    const ifTradeReversalPossible = await checkTradeReversal(
      id,
      stock,
      sampleTrade
    );
    if (!ifTradeReversalPossible) {
      throw new ErrorException(
        ErrorCode.NotFound,
        "Trade deletion not possible since trade you are trying to update is not feasible with your trade history!"
      );
    }
    let result = await TradeModel.destroy({ where: { id } });
    return result;
  } catch (error) {
    throw new ErrorException(ErrorCode.UnknownError, error);
  }
};
