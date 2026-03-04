// controllers/orderController.js
const db = require("../config/db");

// GET all orders with user info (admin only)
exports.getAllOrders = (req, res) => {
  const sql = `
    SELECT o.*, u.full_name, u.email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching orders", error: err });
    res.json(results);
  });
};

// GET single order with items (admin only)
exports.getOrderById = (req, res) => {
  const orderSql = `
    SELECT o.*, u.full_name, u.email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `;
  const itemsSql = `
    SELECT oi.*, p.name, p.image
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;

  db.query(orderSql, [req.params.id], (err, orderResults) => {
    if (err) return res.status(500).json({ message: "Error fetching order" });
    if (orderResults.length === 0) return res.status(404).json({ message: "Order not found" });

    db.query(itemsSql, [req.params.id], (err, itemResults) => {
      if (err) return res.status(500).json({ message: "Error fetching order items" });
      res.json({ ...orderResults[0], items: itemResults });
    });
  });
};

// PUT update order status (admin only)
exports.updateOrderStatus = (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Error updating order status" });
    res.json({ message: "Order status updated successfully" });
  });
};
