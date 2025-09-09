const bcrypt = require("bcryptjs");
const User = require("./models/User");
const { sequelize } = require("./config/db");

async function seedAdmin() {
  try {
    await sequelize.authenticate();

    const existing = await User.findOne({ where: { email: "admin@example.com" } });
    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("New@123", 10);

    await User.create({
      name: "Super Admin", // valid for admin (3–60 chars)
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      address: "HQ Main Office",
    });

    console.log("✅ Admin created: admin@example.com / New@123");
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  } finally {
    process.exit();
  }
}

seedAdmin();
