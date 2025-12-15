const express = require("express");
const router = express.Router();

const connectMongoDB = require("../config/mongodb");
const BlogModel = require("../models/blogmodel");

// -------- GET all blog posts --------
router.get("/blog_data", async (req, res) => {
  try {
    await connectMongoDB();

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

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error("Failed to fetch blog posts:", err.message);
    return res.status(500).json({
      success: false,
      error: "Unable to fetch blog posts",
      message: err.message,
    });
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

  try {
    await connectMongoDB();

    const doc = await BlogModel.findOne({ slug }).lean();

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      id: doc.post_id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: doc.content,
      date: doc.date,
      readTime: doc.readTime,
      tags: doc.tags || [],
    });
  } catch (err) {
    console.error("Failed to fetch blog post:", err.message);
    return res.status(500).json({
      success: false,
      error: "Unable to fetch blog post",
      message: err.message,
    });
  }
});

module.exports = router;