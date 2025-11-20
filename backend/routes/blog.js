const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

const getMySQLConnection = require("../config/mysqldb");
const connectMongoDB = require("../config/mongodb");
const BlogModel = require("../models/blogmodel");

// -------- GET all blog posts --------
router.get("/blog_data", async (req, res) => {
  await connectMongoDB();
  let mysqlConn;

  try {
    // MySQL Query Promise
    const mysqlPromise = (async () => {
      mysqlConn = await getMySQLConnection();

      const [rows] = await mysqlConn.execute(
        "SELECT * FROM blog_data ORDER BY date DESC"
      );

      const formatted = rows.map((row) => ({
        id: row.post_id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        content: row.content,
        date: row.date,
        readTime: row.readTime,
        tags:
          row.tags && typeof row.tags === "string"
            ? JSON.parse(row.tags) || []
            : [],
      }));

      return { db: "mysql", data: formatted };
    })();

    // MongoDB Query Promise
    const mongoPromise = (async () => {
      const docs = await BlogModel.find({}).sort({ date: -1 }).lean();

      const formatted = docs.map((d) => ({
        id: d.post_id,
        title: d.title,
        slug: d.slug,
        excerpt: d.excerpt,
        content: d.content,
        date: d.date,
        readTime: d.readTime,
        tags: d.tags || [],
      }));

      return { db: "mongodb", data: formatted };
    })();

    // Race - choose the fastest DB result
    const fastest = await Promise.race([mysqlPromise, mongoPromise]);

    return res.status(200).json({
      success: true,
      data: fastest.data,
      from: fastest.db,
    });
  } catch (err) {
    console.warn("Fastest DB failed:", err.message);

    // Try fallback DB
    try {
      const fallback = await (async () => {
        try {
          return await mysqlPromise;
        } catch {
          return await mongoPromise;
        }
      })();

      return res.status(200).json({
        success: true,
        data: fallback.data,
        from: fallback.db,
        fallback: true,
      });
    } catch (err2) {
      console.error("Both DB failed:", err2.message);
      return res.status(500).json({
        success: false,
        error: "Unable to fetch blog posts",
      });
    }
  } finally {
    if (mysqlConn) await mysqlConn.end();
  }
});

// -------- GET a single blog post by slug --------
router.get("/blog_data/:slug", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({
      success: false,
      error: "Slug is required",
    });
  }

  await connectMongoDB();
  let mysqlConn;

  // ---- PROPERLY SCOPED QUERY FUNCTIONS ---- //
  const runMySQL = async () => {
    mysqlConn = await getMySQLConnection();
    try {
      const [rows] = await mysqlConn.execute(
        "SELECT * FROM blog_data WHERE slug = ? LIMIT 1",
        [slug]
      );

      if (!rows.length) throw new Error("MySQL Not Found");

      const row = rows[0];
      return {
        db: "mysql",
        post: {
          id: row.post_id,
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          content: row.content,
          date: row.date,
          readTime: row.readTime,
          tags: row.tags ? JSON.parse(row.tags) : [],
        },
      };
    } finally {
      await mysqlConn.end().catch(() => null);
    }
  };

  const runMongo = async () => {
    const doc = await BlogModel.findOne({ slug }).lean();
    if (!doc) throw new Error("Mongo Not Found");

    return {
      db: "mongodb",
      post: {
        id: doc.post_id,
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt,
        content: doc.content,
        date: doc.date,
        readTime: doc.readTime,
        tags: doc.tags || [],
      },
    };
  };

  try {
    // ---- Prefer MySQL for READS ---- //
    const fastest = await Promise.race([runMySQL(), runMongo()]);

    return res.status(200).json({
      success: true,
      from: fastest.db,
      ...fastest.post,
    });
  } catch (err) {
    console.warn("Fastest DB failed:", err.message);

    try {
      // ---- Smart fallback: try Mongo if MySQL failed ---- //
      const fallback = err.message.includes("MySQL")
        ? await runMongo()
        : await runMySQL();

      return res.status(200).json({
        success: true,
        fallback: true,
        from: fallback.db,
        ...fallback.post,
      });
    } catch (err2) {
      console.error("Both DBs failed:", err2.message);
      return res.status(404).json({
        success: false,
        error: "Post not found in any database",
      });
    }
  }
});

module.exports = router;
