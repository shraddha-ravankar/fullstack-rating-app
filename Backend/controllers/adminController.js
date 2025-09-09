const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { User, Store, Rating } = require("../models");

// ================================
// 📌 Dashboard Stats
// ================================
exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

// ================================
// 📌 Add User (admin or normal)
// ================================
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || "user",
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Failed to add user" });
  }
};

// ================================
// 📌 Add Store
// ================================
exports.addStore = async (req, res) => {
  try {
    const { name, address, description, phone, opening_hours, ownerId } = req.body;

    const store = await Store.create({
      name,
      address,
      description,
      phone,
      opening_hours,
      ownerId,
    });

    res.status(201).json({ message: "Store created successfully", store });
  } catch (err) {
    console.error("Error adding store:", err);
    res.status(500).json({ error: "Failed to add store" });
  }
};

// ================================
// 📌 Get Users with Filters
// ================================
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    let where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      include: [
        {
          model: Store,
          as: "ownedStores",
          include: [{ model: Rating, as: "ratings" }],
        },
      ],
    });

    const formatted = users.map((u) => {
      let avgRating = null;

      if (u.role === "owner" && u.ownedStores.length > 0) {
        const allRatings = u.ownedStores.flatMap((store) =>
          store.ratings.map((r) => r.rating)
        );
        avgRating =
          allRatings.length > 0
            ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
            : null;
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        avgRating,
      };
    });

    res.json({ users: formatted });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ================================
// 📌 Get Stores with Filters
// ================================
exports.getStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    let where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
        { model: Rating, as: "ratings" },
      ],
    });

    const formatted = stores.map((s) => {
      const ratings = s.ratings.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : null;

      return {
        id: s.id,
        name: s.name,
        address: s.address,
        owner: s.owner
          ? { id: s.owner.id, name: s.owner.name, email: s.owner.email }
          : null,
        avgRating,
      };
    });

    res.json({ stores: formatted });
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};

// ================================
// 📌 Get Single User (Details)
// ================================
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Store,
          as: "ownedStores",
          include: [{ model: Rating, as: "ratings" }],
        },
      ],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    let avgRating = null;
    if (user.role === "owner" && user.ownedStores.length > 0) {
      const allRatings = user.ownedStores.flatMap((store) =>
        store.ratings.map((r) => r.rating)
      );
      avgRating =
        allRatings.length > 0
          ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
          : null;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      avgRating,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};
