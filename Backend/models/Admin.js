const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: [2, 60]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin'
  }
}, {
  timestamps: true,
});

module.exports = Admin;
