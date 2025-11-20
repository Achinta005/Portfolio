const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_ANIME,
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: true }
  });
};

module.exports = getConnection;
