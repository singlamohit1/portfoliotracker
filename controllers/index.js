import { Sequelize, QueryTypes } from "sequelize";
import { TradeModel, StockModel } from "../config/db/model.js";
import sequelize from "../config/db/index.js";
import RedisClient from "../config/redis/connection.js";
import fs from "fs";
import { ErrorException } from "./error.js";
import { ErrorCode } from "../constants/errorCode.js";

export const addTradeinDb = async (trade) => {
  //If a trade is of type "sold" check If sufficient quantity is there to sell
  if (trade.type == "SELL") {
    let result = await checkIfSufficientQuantity(trade);

    if (!result) {
      throw new ErrorException(
        ErrorCode.NotFound,
        "Trade failed: Not enough quantity available in your portfolio to sell!"
      );
    }
  }
  await TradeModel.create(trade);
};

export const getAllStockIdsAvailable = async () => {
  let stocks = await StockModel.findAll();
  let stocksIds = stocks.map((a) => {
    return a.id;
  });
  console.log(" p2 is ", stocksIds);
  return stocksIds;
};

export const getAllTradeIdsAvailable = async () => {
  let trades = await TradeModel.findAll();
  let tradeIds = trades.map((a) => {
    return a.id;
  });
  console.log(" p2 is ", tradeIds);
  return tradeIds;
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
  console.log("p is", p);
  return p;
};

export const getReturns = async () => {
  let result = await getPortfolio();
  console.log("result is ", result);
  let ff = JSON.parse(result);
  console.log("len is ", ff.length);
  let total = 0;
  let currentprice = 1000;
  for (const trade of ff) {
    total += (currentprice - trade.avgbuyingprice) * trade.sum;
    console.log("rrr  total  is ", total);
  }
  console.log('total ',total)
  return total;
};

export const updateTrade = async (id, updatedTrade) => {
  console.log("hre", id, updatedTrade);
  const stock = await getStockFromTradeId(id);
  const ifTradeReversalPossible = await checkTradeReversal(
    id,
    stock,
    updatedTrade
  );
  console.log("ifTradeReversalPossible is ", ifTradeReversalPossible);
  if (!ifTradeReversalPossible) {
    console.log("inside");
    throw new ErrorException(
      ErrorCode.NotFound,
      "Trade updation not possible since trade you are trying to update is not feasible with your trade history!"
    );
  }
  let results = await TradeModel.update(updatedTrade, { where: { id } });
  return results[0];
  // await TradeModel.create(trade);
};

export const deleteTrade = async (id) => {
  // test is wrong
  // add stock id in that
  const stock = await getStockFromTradeId(id);
  const test = {
    quantity: 0,
    price: 0,
    type: "SELL",
    stockId: stock.stockId,
  };
  console.log("hre", id);
  const ifTradeReversalPossible = await checkTradeReversal(id,stock, test);
  console.log("ifTradeReversalPossible is ", ifTradeReversalPossible);
  if (!ifTradeReversalPossible) {
    console.log("inside");
    throw new ErrorException(
      ErrorCode.NotFound,
      "Trade deletion not possible since trade you are trying to update is not feasible with your trade history!"
    );
  }
  let result = await TradeModel.destroy({ where: { id } });
  return result;
};

export const checkIfSufficientQuantity = async (trade) => {
  console.log("trade is ", trade);
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
  console.log("f is ", result);
  if (!result) return false;
  console.log("f.total_shares", result.dataValues.Total);

  if (result.dataValues.Total < trade.quantity) {
    console.log("inside thorw", trade.quantity);
    return false;
  }
  return true;
};

const checkTradeReversal = async (id, stock, newTrade) => {
  console.log("in check");
  let originalTrades = await TradeModel.findAll({
    where: {
      stockId: stock.stockId,
    },
    order: [["createdAt", "ASC"]],
  });
  console.log('originalTrades is', originalTrades)
  console.log('newTrade is ',newTrade)
  console.log('stock is ',stock)
  // If stock is not updated in the trade
  if (newTrade.stockId == stock.stockId) {
    console.log("originalTrades2 is ", originalTrades);
    const tentativeTrades = originalTrades.map((trade) => {
      if (trade.id == id) {
        console.log("found", id, " ", trade.id);
        trade = newTrade;
      }
      return trade;
    });
    return checkIfQuantityAlwaysPositive(tentativeTrades);
  }
  // If stock is updated in the trade then both previous stock trades feasibility and current stock trades feasibility are to be checked
  else {
    console.log("in else");
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
    console.log("RILtrades is ", RILtrades);

    let relTrades = [];
    if (!RILtrades.length) {
      relTrades.push(stock);
    }
    for (const trade of RILtrades) {
      if (trade.createdAt > stock.createdAt) {
        relTrades.push(stock);
      }
      relTrades.push(trade);
    }
    console.log("relTrades is ", relTrades);
    return checkIfQuantityAlwaysPositive(relTrades);
  }
};

export const checkIfQuantityAlwaysPositive = (tentativeTrades) => {
  let total = 0;
  for (const trade of tentativeTrades) {
    total += trade.type == "BUY" ? trade.quantity : -trade.quantity;
    if (total < 0) {
      console.log("no way!!");
      return false;
    }
  }
  console.log("total now ", total);
  return true;
};

export const getStockFromTradeId = async (id) => {
  let requiredTrade = await TradeModel.findByPk(id);
  return requiredTrade;
};

export const setportfolio = async () => {
  console.log("set portfolio called");
  let temp = fs.readFileSync("portfolio.sql").toString();

  console.log("temp is ", temp);
  const records = await sequelize.query(temp, {
    type: QueryTypes.SELECT,
  });
  console.log("records is ", records);
  RedisClient.set("burrah6", JSON.stringify(records), (err, res) => {
    console.log("err is 11", err);
    console.log("res is 11", res);
    if (err) throw err;
    console.log(res);
  });

};

export const getPortfolio = async () => {
  let portfolio = await RedisClient.get("burrah6", (err, res) => {
    console.log("err is ", err);
    console.log("res is ", res);
    if (err) throw err;
    console.log(res);
  });
  if(portfolio === null)
  {
    console.log('its null')
    await setportfolio()
    portfolio = await RedisClient.get("burrah6", (err, res) => {
        console.log("err is ", err);
        console.log("res is ", res);
        if (err) throw err;
        console.log(res);
      });

  }
  console.log("portfolio is ", portfolio);
  return portfolio;
};
