import mysql from 'mysql2/promise';

const Animepool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.ANIME_DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

Animepool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

(async () => {
  try {
    const connection = await Animepool.getConnection();
    console.log('✅ MySQL Connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
  }
})();

export default Animepool;