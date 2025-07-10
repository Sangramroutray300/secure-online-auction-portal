const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',          // change if using MySQL password
  database: 'auction_portal'
});

module.exports = db;
