const express = require("express");
const router = express.Router();
require("dotenv").config();
const connectMongoDB = require("../config/mongodb");
const contactSchema = require("../models/contactmodel");

// -------- POST: Submit Contact Form --------
router.post("/upload_response", async (req, res) => {
  try {
    await connectMongoDB();
    console.log("MongoDB Connected");

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // MongoDB insert
    const doc = await contactSchema.create({
      name,
      email,
      subject,
      message,
    });

    console.log("✔ MongoDB insert:", doc._id);

    res.status(200).json({
      message: "Response submitted successfully",
      id: doc._id,
    });
  } catch (err) {
    console.error("Error submitting contact form:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------- GET: Fetch Contact Responses --------
router.get("/contact_responses", async (req, res) => {
  try {
    await connectMongoDB();
    console.log("MongoDB connected");

    const docs = await contactSchema.find().sort({ created_at: -1 });

    console.log("✔ Fetched from MongoDB:", docs.length, "documents");

    return res.status(200).json({
      source: "mongodb",
      data: docs,
    });
  } catch (err) {
    console.error("Error fetching contact info:", err);
    res.status(500).json({
      error: "Failed to fetch contact info",
      message: err.message,
    });
  }
});

module.exports = router;