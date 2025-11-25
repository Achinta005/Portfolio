const express = require("express");
const router = express.Router();
const axios = require("axios");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// DB helper
const getMySQLConnection = require("../config/mysqldb");
const connectMongoDB = require("../config/mongodb");
const User = require("../models/usermodel");
const DocumentModel = require("../models/documentmodel");
const BlogModel = require("../models/blogmodel");
const IPModel = require("../models/ipaddressmodel");

// -------- Get IP --------
router.get("/get-ip", async (req, res) => {
  let ipAddress =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.ip;
  let source = "request headers or remote_addr";

  if (!ipAddress || ["::1", "127.0.0.1"].includes(ipAddress)) {
    try {
      const resp = await axios.get("https://api.ipify.org?format=json");
      ipAddress = resp.data.ip;
      source = "external (ipify.org)";
    } catch {
      return res
        .status(500)
        .json({ error: "Unable to detect public IP", source: "localhost" });
    }
  }
  res.json({ IP: ipAddress, source });
});

// -------- View IPs --------
router.get("/view-ip", async (req, res) => {
  try {
    await connectMongoDB();

    const mysqlPromise = (async () => {
      const mysqlConn = await getMySQLConnection();
      try {
        const [rows] = await mysqlConn.execute(`
          SELECT u.id, u.username, i.ipaddress, i.timestamp
          FROM usernames u
          LEFT JOIN ipaddress i ON u.id = i.user_id
          ORDER BY i.timestamp DESC
        `);
        return { source: "mysql", data: rows };
      } finally {
        await mysqlConn.end();
      }
    })();

    const mongoPromise = (async () => {
      const result = await User.aggregate([
        {
          $lookup: {
            from: "ipaddress", // correct collection name from your DB
            localField: "_id",
            foreignField: "user_id",
            as: "ipInfo",
          },
        },
        {
          $unwind: {
            path: "$ipInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            ipaddress: "$ipInfo.ipaddress",
            timestamp: "$ipInfo.timestamp",
          },
        },
        { $sort: { timestamp: -1 } },
      ]);

      return { source: "mongodb", data: result };
    })();

    const fastest = await Promise.race([mysqlPromise, mongoPromise]);
    res.status(200).json(fastest);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch IP addresses",
      message: err.message,
    });
  }
});

// -------- Fetch documents --------
router.post("/fetch_documents", async (req, res) => {
  try {
    // 1️⃣ user coming directly from frontend
    const user = req.body;
    console.log("USER:", user);

    // 2️⃣ extract ownerId
    const ownerId = user.userId ?? user.id ?? user._id;
    if (!ownerId) {
      return res.status(500).json({ error: "User id missing in request" });
    }
    console.log("owner id:", ownerId);

    await connectMongoDB();

    // 3️⃣ Fetch from MySQL
    const mysqlPromise = (async () => {
      const mysqlConn = await getMySQLConnection();
      try {
        const [rows] = await mysqlConn.execute(
          "SELECT id AS doc_id, owner, title, content, created_at, updated_at FROM documents WHERE owner = ? ORDER BY updated_at DESC",
          [user.username.trim()]
        );
        return { source: "mysql", data: rows };
      } finally {
        await mysqlConn.end();
      }
    })();

    // 4️⃣ Fetch from MongoDB
    const mongoPromise = (async () => {
      const result = await DocumentModel.find(
        { owner_id: ownerId },
        "-_id doc_id owner_username title content created_at updated_at"
      )
        .sort({ updated_at: -1 })
        .lean();

      return { source: "mongodb", data: result };
    })();

    // 5️⃣ Combine results
    const results = await Promise.allSettled([mysqlPromise, mongoPromise]);
    const mysqlData =
      results[0].status === "fulfilled" ? results[0].value.data : [];
    const mongoData =
      results[1].status === "fulfilled" ? results[1].value.data : [];

    const mergedMap = new Map();
    [...mysqlData, ...mongoData].forEach((doc) => {
      mergedMap.set(doc.doc_id, {
        ...doc,
        owner: doc.owner ?? user.username.trim(),
        owner_id: ownerId,
      });
    });

    const mergedDocs = [...mergedMap.values()].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    return res.status(200).json({
      message: "Documents fetched",
      count: mergedDocs.length,
      data: mergedDocs,
      sync: {
        mysql: results[0].status,
        mongodb: results[1].status,
      },
    });
  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({
      error: "Failed to fetch documents",
      message: err.message,
    });
  }
});

// -------- AI Summarization --------
router.post("/ai-enhance", async (req, res) => {
  try {
    const text = (req.body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "Text is required" });

    const HF_API_TOKEN = process.env.HF_API_TOKEN;
    if (!HF_API_TOKEN)
      return res.status(500).json({ error: "API token not configured" });

    const url =
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
    const response = await axios.post(
      url,
      {
        inputs: text.slice(0, 10000),
        parameters: { max_length: 1024, min_length: 100, do_sample: false },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      return res.json({
        summary: data[0].summary_text || data[0].generated_text || text,
      });
    } else if (data?.summary_text) {
      return res.json({ summary: data.summary_text });
    }
    return res.json({ summary: text });
  } catch (err) {
    console.error("API route error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
});

// -------- Blog creation --------
const validateBlogPostData = (data) => {
  if (!data.title || !data.excerpt || !data.content)
    throw new Error("Title, excerpt, and content are required");
};

router.post("/upload_blog", async (req, res) => {
  let mysqlConn;

  try {
    const formData = req.body;
    validateBlogPostData(formData);

    await connectMongoDB();

    let {
      title,
      excerpt,
      content,
      tags = [],
      date,
      readTime = "5 min",
      slug,
    } = formData;
    date = date || new Date().toISOString();

    // Generate slug before DB operations
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$|/g, "");
    }

    // First: Get next post_id from MySQL
    mysqlConn = await getMySQLConnection();
    const [lastPost] = await mysqlConn.execute(
      "SELECT post_id FROM blog_data ORDER BY post_id DESC LIMIT 1"
    );
    const nextPostId = lastPost.length ? lastPost[0].post_id + 1 : 1;

    // Ensure unique slug using post_id
    slug = `${slug}-${nextPostId}`;

    const tagsJson = JSON.stringify(tags);

    // MySQL Write Promise
    const mysqlPromise = (async () => {
      await mysqlConn.execute(
        `INSERT INTO blog_data 
         (post_id, title, content, excerpt, slug, tags, date, readTime, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [nextPostId, title, content, excerpt, slug, tagsJson, date, readTime]
      );

      return {
        db: "mysql",
        id: nextPostId,
      };
    })();

    // MongoDB Write Promise
    const mongoPromise = (async () => {
      const doc = await BlogModel.create({
        post_id: nextPostId, // SAME ID AS MYSQL
        title,
        excerpt,
        content,
        slug,
        tags,
        date,
        readTime,
      });

      return {
        db: "mongodb",
        id: doc.post_id,
      };
    })();

    // Run both without failing first response
    const results = await Promise.allSettled([mysqlPromise, mongoPromise]);

    const success = results.filter((r) => r.status === "fulfilled");

    // Error if both failed
    if (success.length === 0) {
      return res.status(500).json({
        message: "Both MySQL and MongoDB failed",
        details: {
          mysql: results[0].reason?.message,
          mongodb: results[1].reason?.message,
        },
      });
    }

    return res.status(201).json({
      message: "Blog stored successfully",
      stored_in: success.map((r) => r.value.db),
      slug,
      title,
      excerpt,
      content,
      date,
      readTime,
      tags,
      fallback: results.some((r) => r.status === "rejected"),
    });
  } catch (err) {
    console.error("Blog upload failed:", err);
    return res.status(500).json({ message: err.message });
  } finally {
    if (mysqlConn) await mysqlConn.end();
  }
});

// -------- Save IP --------
router.post("/get-ip", async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  // Detect client IP
  let ipAddress =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"];

  if (!ipAddress || ["::1", "127.0.0.1"].includes(ipAddress)) {
    try {
      const resp = await axios.get("https://api.ipify.org?format=json");
      ipAddress = resp.data.ip;
    } catch {
      return res.status(500).json({ error: "Unable to detect IP" });
    }
  }

  await connectMongoDB();

  // MySQL check/insert
  const mysqlWrite = (async () => {
    const mysqlConn = await getMySQLConnection();
    try {
      const [rows] = await mysqlConn.execute(
        "SELECT user_id FROM ipaddress WHERE ipaddress = ? LIMIT 1",
        [ipAddress]
      );

      if (rows.length) {
        return { db: "mysql", status: "existing", user_id: rows[0].user_id };
      }

      await mysqlConn.execute(
        "INSERT INTO ipaddress (user_id, ipaddress) VALUES (?, ?)",
        [user_id, ipAddress]
      );

      return { db: "mysql", status: "inserted", user_id };
    } finally {
      await mysqlConn.end();
    }
  })();

  // Mongo check/insert
  const mongoWrite = (async () => {
    const existing = await IPModel.findOne({ ipaddress: ipAddress });

    if (existing) {
      return {
        db: "mongodb",
        status: "existing",
        user_id: existing.user_id,
      };
    }

    await IPModel.create({
      user_id: user_id,
      ipaddress: ipAddress,
      timestamp: new Date(),
    });

    return { db: "mongodb", status: "inserted", user_id };
  })();

  // Race for fastest response, but complete both tasks
  const results = await Promise.allSettled([mysqlWrite, mongoWrite]);

  const fastest =
    results[0].status === "fulfilled"
      ? results[0]
      : results[1].status === "fulfilled"
      ? results[1]
      : null;

  const success = results.filter((r) => r.status === "fulfilled");
  const failure = results.filter((r) => r.status === "rejected");

  if (!fastest) {
    console.error(
      "Both IP writes failed:",
      failure.map((f) => f.reason)
    );
    return res.status(500).json({ error: "Failed to store or lookup IP" });
  }

  return res.status(fastest.value.status === "inserted" ? 201 : 200).json({
    ip: ipAddress,
    user_id: fastest.value.user_id,
    status: fastest.value.status,
    primary_db: fastest.value.db,
    synced: failure.length === 0,
  });
});

// -------- Create document --------
router.post("/create_documents", async (req, res) => {
  try {
    // (1) Extract user directly from body
    const user = req.body.user;

    if (!user) {
      return res
        .status(400)
        .json({ error: "User data missing in request body" });
    }

    // (2) Extract ownerId from user object
    const ownerId = user.userId ?? user.id ?? user._id;
    if (!ownerId) {
      return res.status(500).json({
        error: "User id missing in provided user object",
      });
    }

    // (3) Extract title + content
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content required" });
    }

    await connectMongoDB();

    let mysqlConn;
    let nextDocId;

    try {
      mysqlConn = await getMySQLConnection();

      // (4) INSERT into MySQL first to generate doc_id
      const [result] = await mysqlConn.execute(
        "INSERT INTO documents (owner, title, content, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [user.username.trim(), title, content]
      );

      nextDocId = result.insertId;

      const mysqlWrite = Promise.resolve({
        db: "mysql",
        id: nextDocId,
        status: "inserted",
      });

      // (5) INSERT into MongoDB with same doc_id
      const mongoWrite = await DocumentModel.create({
        doc_id: nextDocId,
        owner_id: ownerId,
        owner_username: user.username.trim(),
        title,
        content,
        created_at: new Date(),
        updated_at: new Date(),
      })
        .then(() => ({
          db: "mongodb",
          id: nextDocId,
          status: "inserted",
        }))
        .catch((err) => Promise.reject(err));

      const results = await Promise.allSettled([mysqlWrite, mongoWrite]);
      const success = results.filter((r) => r.status === "fulfilled");
      const failure = results.filter((r) => r.status === "rejected");

      return res.status(success.length ? 201 : 500).json({
        message: success.length
          ? "Document stored"
          : "Failed to store document",
        doc_id: nextDocId,
        stored_in: success.map((r) => r.value.db),
        fallback: failure.length > 0,
      });
    } catch (err) {
      console.error("Create document failed:", err);
      return res.status(500).json({ error: err.message });
    } finally {
      if (mysqlConn) await mysqlConn.end();
    }
  } catch (err) {
    console.error("Create documents outer error:", err);
    res.status(500).json({
      error: "Failed to create document",
      message: err.message,
    });
  }
});

module.exports = router;
