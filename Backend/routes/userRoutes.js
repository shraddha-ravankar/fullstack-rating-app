const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/stores', auth, userController.getStores); // auth optional — but we require user to get "myRating"; we used auth
router.post('/stores/:id/rating', auth, userController.submitRating);
router.put('/stores/:id/rating', auth, userController.updateRating);

module.exports = router;
