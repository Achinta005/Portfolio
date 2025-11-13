const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: true 
    }
  });
};


// -------- GET all blog posts --------
router.get("/blog_data", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM blog_data ORDER BY date DESC");

    const posts = rows.map((row) => ({
      id: row.post_id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      date: row.date,
      readTime: row.readTime,
      tags: row.tags && typeof row.tags === "string" ? row.tags.split(",") : [],
    }));

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    res.status(500).json({ error: "Error fetching blog posts", message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- GET a single blog post by slug --------
router.get("/blog_data/:slug", async (req, res) => {
  const { slug } = req.params;
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM blog_data WHERE slug = ? LIMIT 1", [slug]);

    if (!rows.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    const row = rows[0];
    const post = {
      id: row.post_id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      date: row.date,
      readTime: row.readTime,
      tags: row.tags && typeof row.tags === "string" ? row.tags.split(",") : [],
    };

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching blog post:", err);
    res.status(500).json({ error: "Error fetching blog post", message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

module.exports = router;
