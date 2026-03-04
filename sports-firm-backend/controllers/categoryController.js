// controllers/categoryController.js
const db = require("../config/db");

// GET all categories
exports.getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories ORDER BY name ASC", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching categories" });
    res.json(results);
  });
};

// POST add category (admin only)
exports.addCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required" });

  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ message: "Error adding category" });
    res.status(201).json({ message: "Category added", id: result.insertId });
  });
};
