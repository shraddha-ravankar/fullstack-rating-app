const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const bcrypt = require('bcrypt');

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

    // validate new password
    if (newPassword.length < 8) return res.status(400).json({ error: 'New password too short' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.dashboard = async (req, res) => {
  try {
    // get store owned by this user
    const store = await Store.findOne({ where: { ownerId: req.user.id } })
    if (!store) return res.status(404).json({ error: 'Store not found for this owner' });

    // get ratings for that store
    const ratings = await Rating.find({ store: store._id }).populate('user', 'name email address');
    const avgRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      store: { id: store._id, name: store.name, address: store.address },
      averageRating: avgRating,
      totalRatings: ratings.length,
      users: ratings.map(r => ({
        userId: r.user._id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
        rating: r.rating
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};