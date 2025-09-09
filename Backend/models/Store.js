const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Store = sequelize.define(
  "Store",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  { timestamps: true }
);

Store.associate = (models) => {
  Store.belongsTo(models.User, { as: "owner", foreignKey: "ownerId" });
  Store.hasMany(models.Rating, { as: "ratings", foreignKey: "storeId" });
};

module.exports = Store;
