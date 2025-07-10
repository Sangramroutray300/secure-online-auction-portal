const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Place a bid
router.post('/', verifyToken, (req, res) => {
  const { product_id, bid_amount } = req.body;

  db.query("INSERT INTO bids (user_id, product_id, bid_amount) VALUES (?, ?, ?)",
    [req.user.id, product_id, bid_amount],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Bid placed" });
    }
  );
});

// Get bids for a product
router.get('/:product_id', (req, res) => {
  db.query("SELECT * FROM bids WHERE product_id = ? ORDER BY bid_time DESC", [req.params.product_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
