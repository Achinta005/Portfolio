const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // 🔑 Add this to enable SSL/TLS encryption for the connection
  ssl: {
    rejectUnauthorized: true, 
  },
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connection successfull');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
  }
})();

module.exports = pool;