const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Admin Dashboard
router.get("/dashboard", auth, role(["admin"]), adminController.dashboard);

// Add users / stores
router.post("/add-user", auth, role(["admin"]), adminController.addUser);
router.post("/add-store", auth, role(["admin"]), adminController.addStore);

// Get all users & stores
router.get("/users", auth, role(["admin"]), adminController.getUsers);
router.get("/stores", auth, role(["admin"]), adminController.getStores);

// Get single user details
router.get("/users/:id", auth, role(["admin"]), adminController.getUserDetails);

module.exports = router;
