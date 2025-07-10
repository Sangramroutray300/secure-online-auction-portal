const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // ← change if your MySQL has a password
  database: 'auction_db'
});

// ✅ Register route
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  const hashed = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashed],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json('Email already exists');
        }
        return res.status(500).json(err);
      }
      res.json({ msg: 'User registered' });
    }
  );
});

// ✅ Login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json('User not found');

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json('Invalid password');

    const token = jwt.sign({ id: user.id }, 'secretkey');
    res.json({ token, user });
  });
});

// ✅ Start server
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
