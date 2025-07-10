const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Register route
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: 'User registered' });
    }
  );
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json("User not found");

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return res.status(401).json("Invalid password");

    const token = jwt.sign({ id: user.id }, "secretkey");
    res.json({ token, user });
  });
});

module.exports = router;
