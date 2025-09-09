// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const AdminSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     default: 'admin'
//   }
// }, { timestamps: true });

// // Encrypt password before saving
// AdminSchema.pre('save', async function(next) {
//   if(!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// module.exports = mongoose.model('Admin', AdminSchema);



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
