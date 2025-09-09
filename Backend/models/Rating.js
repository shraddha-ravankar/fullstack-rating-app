const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Rating = sequelize.define(
  "Rating",
  {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: true }
);

Rating.associate = (models) => {
  Rating.belongsTo(models.User, { as: "user", foreignKey: "userId" });
  Rating.belongsTo(models.Store, { as: "store", foreignKey: "storeId" });
};

module.exports = Rating;
