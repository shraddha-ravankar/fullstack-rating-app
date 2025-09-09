const { Store, Rating, User } = require("../models");
const { Op } = require("sequelize");

// Get stores with filters, avg rating, and user's rating
exports.getStores = async (req, res) => {
  try {
    const { name, address, sortBy = "name", order = "asc" } = req.query;

    // Build filter
    const filter = {};
    if (name) filter.name = { [Op.like]: `%${name}%` };
    if (address) filter.address = { [Op.like]: `%${address}%` };

    // Fetch stores + ratings + owner
    const stores = await Store.findAll({
      where: filter,
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email", "address"] },
        { model: Rating, include: [{ model: User, attributes: ["id", "name"] }] }
      ],
      order: [[sortBy, order.toUpperCase()]]
    });

    // Build response with avg + myRating
    const result = stores.map((store) => {
      const ratings = store.Ratings || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      const myRating =
        ratings.find((r) => r.userId === req.user?.id)?.rating || null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        owner: store.owner,
        avgRating: Number(avgRating.toFixed(2)),
        ratingCount: ratings.length,
        myRating
      };
    });

    res.json({ stores: result });
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Submit new rating
exports.submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1–5" });
    }

    // Check if already rated
    const existing = await Rating.findOne({ where: { userId, storeId } });
    if (existing) {
      return res
        .status(400)
        .json({ error: "You already rated this store. Use PUT to update." });
    }

    const newRating = await Rating.create({ userId, storeId, rating });
    res.json({ message: "Rating submitted", rating: newRating });
  } catch (err) {
    console.error("Error submitting rating:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update existing rating
exports.updateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1–5" });
    }

    const updated = await Rating.findOne({ where: { userId, storeId } });
    if (!updated) {
      return res
        .status(404)
        .json({ error: "Rating not found. Use POST to create." });
    }

    updated.rating = rating;
    await updated.save();

    res.json({ message: "Rating updated", rating: updated });
  } catch (err) {
    console.error("Error updating rating:", err);
    res.status(500).json({ error: "Server error" });
  }
};
