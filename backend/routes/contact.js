const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
require("dotenv").config();

// Helper function to get DB connection
const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: true,
    },
  });
};

// -------- POST: submit contact form --------
router.post("/upload_response", async (req, res) => {
  let conn;
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO contact_info (name, email, subject, message, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, email, subject, message]
    );

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (err) {
    console.error("Error submitting contact form:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- GET: fetch all contact responses --------
router.get("/contact_responses", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM contact_info");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching contact info:", err);
    res.status(500).json({
      error: "Failed to fetch contact info",
      message: err.message,
    });
  } finally {
    if (conn) await conn.end();
  }
});

module.exports = router;
