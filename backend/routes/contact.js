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

module.exports = router;