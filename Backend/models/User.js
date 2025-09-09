const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        customLen(value) {
          if (this.role === "user") {
            if (value.length < 20 || value.length > 60) {
              throw new Error("User name must be between 20 and 60 characters");
            }
          } else {
            if (value.length < 3 || value.length > 60) {
              throw new Error("Name must be between 3 and 60 characters");
            }
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "owner"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    timestamps: true,
  }
);



User.associate = (models) => {
  // A User (customer) can give many ratings
  User.hasMany(models.Rating, { as: "ratings", foreignKey: "userId" });

  // A User (owner) can own many stores
  User.hasMany(models.Store, { as: "stores", foreignKey: "ownerId" });
};


module.exports = User;
