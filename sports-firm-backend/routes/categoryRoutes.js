// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public
router.get("/", categoryController.getAllCategories);

// Admin only
router.post("/", authMiddleware, adminMiddleware, categoryController.addCategory);

module.exports = router;
