import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
  }
})();

export default pool;