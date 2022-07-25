import { getPortfolio } from "./portfolio.js";
import { ErrorException } from "../utils/errorHandler.js";
import { ErrorCode } from "../constants/errorCode.js";

export const getReturns = async () => {
  try {
    let result = await getPortfolio();
    let portfolioTrades = JSON.parse(result);
    let total = 0;
    let currentprice = 100;
    for (const trade of portfolioTrades) {
      total += (currentprice - trade.avgbuyingprice) * trade.sum;
    }
    return total;
  } catch (error) {
    throw new ErrorException(ErrorCode.UnknownError, error);
  }
};
