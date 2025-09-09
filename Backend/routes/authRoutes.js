
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/update-password', protect, authController.updatePassword);

module.exports = router;
