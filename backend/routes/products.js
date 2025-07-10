const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Get all products
router.get('/', (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

// Admin create product
router.post('/', verifyToken, (req, res) => {
  const { name, description, starting_price } = req.body;
  db.query("INSERT INTO products (name, description, starting_price, created_by) VALUES (?, ?, ?, ?)",
    [name, description, starting_price, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Product created" });
    }
  );
});

module.exports = router;
