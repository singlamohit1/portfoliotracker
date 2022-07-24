import { getPortfolio } from "./portfolio.js";

export const getReturns = async () => {
  let result = await getPortfolio();
  let portfolioTrades = JSON.parse(result);
  let total = 0;
  let currentprice = 1000;
  for (const trade of portfolioTrades) {
    total += (currentprice - trade.avgbuyingprice) * trade.sum;
  }
  return total;
};
