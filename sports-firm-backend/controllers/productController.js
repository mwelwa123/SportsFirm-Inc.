// controllers/productController.js
const db = require("../config/db");

// GET all products (with category name)
exports.getAllProducts = (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching products", error: err });
    res.json(results);
  });
};

// GET single product
exports.getProductById = (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching product" });
    if (results.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
};

// POST add new product (admin only)
exports.addProduct = (req, res) => {
  const { name, description, price, stock, image, category_id } = req.body;

  if (!name || !price || !category_id) {
    return res.status(400).json({ message: "Name, price and category are required" });
  }

  const sql = "INSERT INTO products (name, description, price, stock, image, category_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, description, price, stock || 0, image, category_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error adding product", error: err });
    res.status(201).json({ message: "Product added successfully", id: result.insertId });
  });
};

// PUT update product (admin only)
exports.updateProduct = (req, res) => {
  const { name, description, price, stock, image, category_id } = req.body;
  const sql = "UPDATE products SET name=?, description=?, price=?, stock=?, image=?, category_id=? WHERE id=?";
  db.query(sql, [name, description, price, stock, image, category_id, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Error updating product", error: err });
    res.json({ message: "Product updated successfully" });
  });
};

// DELETE product (admin only)
exports.deleteProduct = (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Error deleting product", error: err });
    res.json({ message: "Product deleted successfully" });
  });
};
