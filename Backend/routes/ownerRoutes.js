const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { User, Store, Rating } = require("../models");

// GET /api/owner/dashboard
router.get("/dashboard", auth, role(["owner"]), async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [{ model: Rating, as: "ratings", include: [{ model: User, as: "user" }] }]
,
    });

    const result = stores.map((store) => {
      const ratings = store.Ratings || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        avgRating: Number(avgRating.toFixed(1)),
        ratings: ratings.map((r) => ({
          id: r.id,
          rating: r.rating,
          userName: r.User?.name,
          userEmail: r.User?.email,
        })),
      };
    });

    res.json({ stores: result });
  } catch (err) {
    console.error("Error fetching owner dashboard:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
