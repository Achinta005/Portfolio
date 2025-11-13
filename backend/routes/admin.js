const express = require("express");
const router = express.Router();
const axios = require("axios");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// DB helper
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

// JWT helper
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const getUserFromToken = (req) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return null;
    const token = authHeader.replace("Bearer ", "");
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// -------- AI Summarization --------
router.post("/ai-enhance", async (req, res) => {
  try {
    const text = (req.body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "Text is required" });

    const HF_API_TOKEN = process.env.HF_API_TOKEN;
    if (!HF_API_TOKEN) return res.status(500).json({ error: "API token not configured" });

    const url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
    const response = await axios.post(
      url,
      { inputs: text.slice(0, 10000), parameters: { max_length: 1024, min_length: 100, do_sample: false } },
      { headers: { Authorization: `Bearer ${HF_API_TOKEN}`, "Content-Type": "application/json" } }
    );

    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      return res.json({ summary: data[0].summary_text || data[0].generated_text || text });
    } else if (data?.summary_text) {
      return res.json({ summary: data.summary_text });
    }
    return res.json({ summary: text });
  } catch (err) {
    console.error("API route error:", err);
    return res.status(500).json({ error: "Internal server error", message: err.message });
  }
});

// -------- Blog creation --------
const validateBlogPostData = (data) => {
  if (!data.title || !data.excerpt || !data.content) throw new Error("Title, excerpt, and content are required");
};

router.post("/upload_blog", async (req, res) => {
  let conn;
  try {
    const formData = req.body;
    validateBlogPostData(formData);

    let { title, excerpt, content, tags = [], date, readTime = "5 min", slug } = formData;
    date = date || new Date().toISOString();

    conn = await getConnection();
    const [lastPost] = await conn.execute("SELECT post_id FROM blog_data ORDER BY post_id DESC LIMIT 1");
    const nextPostId = lastPost.length ? lastPost[0].post_id + 1 : 1;

    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$|/g, "");
    }

    const [existingSlug] = await conn.execute("SELECT post_id FROM blog_data WHERE slug = ?", [slug]);
    if (existingSlug.length) slug = `${slug}-${nextPostId}`;

    const tagsJson = JSON.stringify(tags);

    await conn.execute(
      `INSERT INTO blog_data 
       (post_id, title, content, excerpt, slug, tags, date, readTime, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [nextPostId, title, content, excerpt, slug, tagsJson, date, readTime]
    );

    res.status(201).json({ id: nextPostId, title, slug, excerpt, content, date, readTime, tags });
  } catch (err) {
    console.error("Error creating blog post:", err);
    res.status(500).json({ error: "Error creating blog post", message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Save IP --------
router.post("/get-ip", async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id is required" });

  let ipAddress = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.headers["x-real-ip"];
  if (!ipAddress || ["::1", "127.0.0.1"].includes(ipAddress)) {
    try {
      const resp = await axios.get("https://api.ipify.org?format=json");
      ipAddress = resp.data.ip;
    } catch {
      return res.status(500).json({ error: "Unable to detect IP", source: "localhost" });
    }
  }

  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT user_id FROM ipaddress WHERE ipaddress = ? LIMIT 1", [ipAddress]);
    if (rows.length) return res.status(200).json({ ip: ipAddress, user_id: rows[0].user_id, status: "existing", source: "database" });

    await conn.execute("INSERT INTO ipaddress (user_id, ipaddress) VALUES (?, ?)", [user_id, ipAddress]);
    res.status(201).json({ ip: ipAddress, user_id, status: "inserted", source: "headers" });
  } catch (err) {
    console.error("Database operation failed:", err);
    res.status(500).json({ error: "Database operation failed" });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Get IP --------
router.get("/get-ip", async (req, res) => {
  let ipAddress = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.headers["x-real-ip"] || req.ip;
  let source = "request headers or remote_addr";

  if (["::1", "127.0.0.1"].includes(ipAddress)) {
    try {
      const resp = await axios.get("https://api.ipify.org?format=json", { timeout: 3000 });
      ipAddress = resp.data.ip;
      source = "external (ipify.org)";
    } catch {
      return res.status(500).json({ error: "Unable to detect public IP", source: "localhost" });
    }
  }
  res.json({ IP: ipAddress, source });
});

// -------- View IPs --------
router.get("/view-ip", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT u.id, u.username, i.ipaddress, i.timestamp
      FROM usernames u
      LEFT JOIN ipaddress i ON u.id = i.user_id
      ORDER BY i.timestamp DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch IP addresses", message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Fetch documents --------
router.get("/fetch_documents", async (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute(
      "SELECT * FROM documents WHERE owner = ? ORDER BY updated_at DESC",
      [user.username]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Create document --------
router.post("/create_documents", async (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Title and content required" });

  let conn;
  try {
    conn = await getConnection();
    const [result] = await conn.execute(
      "INSERT INTO documents(owner, title, content, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [user.username, title, content]
    );
    res.status(201).json({ message: "Document created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

module.exports = router;
