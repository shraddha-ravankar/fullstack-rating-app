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





module.exports = User;
