import { Sequelize } from "sequelize";
import { TradeModel, StockModel } from "../config/db/model.js";

export const checkIfSufficientQuantity = async (trade) => {
  var query = {
    attributes: [
      [
        Sequelize.literal(
          `SUM(CASE type WHEN 'BUY' THEN quantity ELSE -quantity END)`
        ),
        "Total",
      ],
    ],
    where: {
      stockId: trade.stockId,
    },
    group: ["stockId"],
  };
  let result = await TradeModel.findOne(query);
  if (!result) return false;

  if (result.dataValues.Total < trade.quantity) {
    return false;
  }
  return true;
};

export const checkTradeReversal = async (id, correspondingTrade, newTrade) => {
  let originalTrades = await TradeModel.findAll({
    where: {
      stockId: correspondingTrade.stockId,
    },
    order: [["createdAt", "ASC"]],
  });
  // If stock is not updated in the trade
  if (newTrade.stockId == correspondingTrade.stockId) {
    const tentativeTrades = originalTrades.map((trade) => {
      if (trade.id == id) {
        trade = newTrade;
      }
      return trade;
    });
    return checkIfQuantityAlwaysPositive(tentativeTrades);
  }
  // If stock is updated in the trade then both previous stock trades feasibility and current stock trades feasibility are to be checked
  else {
    const tentativeTrades = originalTrades.map((trade) => {
      if (trade.id == id) {
        trade.quantity = 0;
      }
      return trade;
    });
    if (!checkIfQuantityAlwaysPositive(tentativeTrades)) {
      return false;
    }
    //now check RIL ones
    // get all RIL ones and insert the current one there with correct timestamp
    let RILtrades = await TradeModel.findAll({
      where: {
        stockId: newTrade.stockId,
      },
      order: [["createdAt", "ASC"]],
    });

    let relTrades = [];
    if (!RILtrades.length) {
      relTrades.push(newTrade);
    }
    for (const trade of RILtrades) {
      if (trade.createdAt > correspondingTrade.createdAt) {
        relTrades.push(newTrade);
      }
      relTrades.push(trade);
    }
    return checkIfQuantityAlwaysPositive(relTrades);
  }
};

export const checkIfQuantityAlwaysPositive = (tentativeTrades) => {
  let total = 0;
  for (const trade of tentativeTrades) {
    total += trade.type == "BUY" ? trade.quantity : -trade.quantity;
    if (total < 0) {
      return false;
    }
  }
  return true;
};

export const getAllStockIdsAvailable = async () => {
  let stocks = await StockModel.findAll();
  let stocksIds = stocks.map((stock) => {
    return stock.id;
  });
  return stocksIds;
};

export const getAllTradeIdsAvailable = async () => {
  let trades = await TradeModel.findAll();
  let tradeIds = trades.map((trade) => {
    return trade.id;
  });
  return tradeIds;
};

export const getTradeFromTradeId = async (id) => {
  let requiredTrade = await TradeModel.findByPk(id);
  return requiredTrade;
};
