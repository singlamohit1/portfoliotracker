import { Sequelize, DataTypes } from "sequelize";
import sequelize from "./index.js";

export const StockModel = sequelize.define(
  "stock",
  { symbol: DataTypes.STRING },
  { timestamps: false }
);

export const TradeModel = sequelize.define("trade", {
  quantity: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  type: {
    type: Sequelize.ENUM("BUY", "SELL"),
  },
});

StockModel.hasOne(TradeModel, {
  foreignKey: "stockId",
  allowNull: false,
});
TradeModel.belongsTo(StockModel);

export const initDb = async () => {
  await sequelize.sync();

  console.log("now ---------------");
  await StockModel.create({
    symbol: "TCS",
  });
  await StockModel.create({
    symbol: "WIPRO",
  });
  await StockModel.create({
    symbol: "GODREJIND",
  });
};
