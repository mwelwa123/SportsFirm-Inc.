// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Admin only
router.get("/", authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get("/:id", authMiddleware, adminMiddleware, orderController.getOrderById);
router.put("/:id/status", authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;
