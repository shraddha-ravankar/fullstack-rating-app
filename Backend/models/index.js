const Admin = require("./Admin");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Associations
User.hasMany(Store, { as: "ownedStores", foreignKey: "ownerId" });
Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

User.hasMany(Rating, { as: "userRatings", foreignKey: "userId" });
Rating.belongsTo(User, { as: "user", foreignKey: "userId" });

Store.hasMany(Rating, { as: "ratings", foreignKey: "storeId" });
Rating.belongsTo(Store, { as: "store", foreignKey: "storeId" });

module.exports = {
  Admin,
  User,
  Store,
  Rating,
};
