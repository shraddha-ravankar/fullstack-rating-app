require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    let name = process.env.ADMIN_NAME || 'System Administrator User';
    if (name.length < 20) {
      console.warn('ADMIN_NAME too short, padding to 20+ chars...');
      name = name.padEnd(21, '_');
    }

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'NewPass@123';

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Admin already exists with email:', email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin created:', { id: admin.id, email: admin.email });
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
  }
})();
