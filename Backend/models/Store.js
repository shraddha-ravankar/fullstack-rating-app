const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Store = sequelize.define(
  "Store",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    opening_hours: { type: DataTypes.STRING },
    images: { type: DataTypes.JSON },
  },
  {
    timestamps: true,
  }
);

module.exports = Store;
