const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// DB helper
const connectMongoDB = require("../config/mongodb");
const User = require("../models/usermodel");
const DocumentModel = require("../models/documentmodel");
const BlogModel = require("../models/blogmodel");
const IPModel = require("../models/ipaddressmodel");

// -------- Fetch documents --------
router.post("/fetch_documents", async (req, res) => {
  try {
    const user = req.body;
    console.log("USER:", user);

    const ownerId = user.userId ?? user.id ?? user._id;
    if (!ownerId) {
      return res.status(500).json({ error: "User id missing in request" });
    }
    console.log("owner id:", ownerId);

    await connectMongoDB();

    const result = await DocumentModel.find(
      { owner_id: ownerId },
      "-_id doc_id owner_username title content created_at updated_at"
    )
      .sort({ updated_at: -1 })
      .lean();

    const documents = result.map((doc) => ({
      ...doc,
      owner: doc.owner_username ?? user.username.trim(),
      owner_id: ownerId,
    }));

    return res.status(200).json({
      message: "Documents fetched",
      count: documents.length,
      data: documents,
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

    // Get next post_id from MongoDB
    const lastPost = await BlogModel.findOne()
      .sort({ post_id: -1 })
      .select("post_id")
      .lean();
    const nextPostId = lastPost ? lastPost.post_id + 1 : 1;

    // Generate slug
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$|/g, "");
    }

    // Ensure unique slug using post_id
    slug = `${slug}-${nextPostId}`;

    // Create blog post in MongoDB
    const doc = await BlogModel.create({
      post_id: nextPostId,
      title,
      excerpt,
      content,
      slug,
      tags,
      date,
      readTime,
    });

    return res.status(201).json({
      message: "Blog stored successfully",
      slug,
      title,
      excerpt,
      content,
      date,
      readTime,
      tags,
      post_id: nextPostId,
    });
  } catch (err) {
    console.error("Blog upload failed:", err);
    return res.status(500).json({ message: err.message });
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

  try {
    await connectMongoDB();

    // Check if IP exists
    const existing = await IPModel.findOne({ ipaddress: ipAddress });

    if (existing) {
      return res.status(200).json({
        ip: ipAddress,
        user_id: existing.user_id,
        status: "existing",
      });
    }

    // Insert new IP
    await IPModel.create({
      user_id: user_id,
      ipaddress: ipAddress,
      timestamp: new Date(),
    });

    return res.status(201).json({
      ip: ipAddress,
      user_id: user_id,
      status: "inserted",
    });
  } catch (err) {
    console.error("IP storage error:", err);
    return res.status(500).json({ 
      error: "Failed to store or lookup IP",
      message: err.message 
    });
  }
});

// -------- View IPs with Username --------
router.get("/view-ip", async (req, res) => {
  try {
    await connectMongoDB();

    const result = await IPModel.aggregate([
      // Join with users collection
      {
        $lookup: {
          from: "usernames",           // MongoDB collection name
          localField: "user_id",   // field in IPModel
          foreignField: "_id",     // field in User model
          as: "userInfo",
        },
      },
      // Flatten userInfo array
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Format output
      {
        $project: {
          _id: 0,
          ipaddress: "$ipaddress",
          user_id: "$user_id",
          username: "$userInfo.username",
          timestamp: 1,
          status: {
            $cond: [
              { $ifNull: ["$userInfo", false] },
              "stored",
              "user_not_found",
            ],
          },
        },
      },
      // Latest first
      { $sort: { timestamp: -1 } },
    ]);

    return res.status(200).json({
      source: "mongodb",
      count: result.length,
      data: result,
    });
  } catch (err) {
    console.error("View IP error:", err);
    return res.status(500).json({
      error: "Failed to fetch IP addresses",
      message: err.message,
    });
  }
});

// -------- Create document --------
router.post("/create_documents", async (req, res) => {
  try {
    const user = req.body.user;

    if (!user) {
      return res
        .status(400)
        .json({ error: "User data missing in request body" });
    }

    const ownerId = user.userId ?? user.id ?? user._id;
    if (!ownerId) {
      return res.status(500).json({
        error: "User id missing in provided user object",
      });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content required" });
    }

    await connectMongoDB();

    // Get next doc_id from MongoDB
    const lastDoc = await DocumentModel.findOne()
      .sort({ doc_id: -1 })
      .select("doc_id")
      .lean();
    const nextDocId = lastDoc ? lastDoc.doc_id + 1 : 1;

    // Create document in MongoDB
    await DocumentModel.create({
      doc_id: nextDocId,
      owner_id: ownerId,
      owner_username: user.username.trim(),
      title,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({
      message: "Document stored",
      doc_id: nextDocId,
    });
  } catch (err) {
    console.error("Create documents error:", err);
    res.status(500).json({
      error: "Failed to create document",
      message: err.message,
    });
  }
});

module.exports = router;