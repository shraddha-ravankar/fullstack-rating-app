// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config(); // make sure env vars are loaded

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// module.exports = 
// config/db.js
// config/db.js


const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected.');
  } catch (err) {
    console.error(' DB connection error:', err);
  }
};

module.exports = { sequelize, connectDB };






