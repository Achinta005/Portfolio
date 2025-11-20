const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  post_id: Number,
  title: String,
  excerpt: String,
  content: String,
  slug: String,
  tags: [String],
  date: String,
  readTime: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BlogModel", BlogSchema, "Blog_data");
