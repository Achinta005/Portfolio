const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/auth");
const Document = require('../models/Document');

router.post("/register", register);
router.post("/login", login);

// This endpoint is for dashboard stats and remains unchanged.
router.get("/dashboard", auth, (req, res) => {
  // ... (logic for dashboard stats)
});

// This endpoint fetches documents and remains unchanged.
router.get("/documents", auth, async (req, res) => {
  try {
    // --- FIX 1: Use req.user.id to match your JWT payload ---
    const userDocuments = await Document.find({
      owner_id: req.user.id, // Changed from req.user.userId
    }).sort({ updatedAt: -1 });
    res.json(userDocuments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});


// --- FIX 2: Corrected logic and structure for POST /documents ---
router.post("/documents", auth, async (req, res) => {
  // The try...catch block should wrap the entire logic.
  try {
    const { title, content } = req.body;
    
    // Change 'userId' to 'id' to match your JWT payload.
    const owner_id = req.user.id; 

    // Add a specific check to ensure the token payload is valid.
    if (!owner_id) {
      console.error("FATAL: JWT payload is missing the 'id' field.", req.user);
      return res.status(403).json({ error: "Invalid token payload." });
    }
    
    // Perform validation *before* creating the document.
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required fields." });
    }

    // Create the new document instance.
    const newDocument = new Document({
      title,
      content,
      owner_id,
    });

    // Save the document to the database.
    await newDocument.save();

    // Respond with success.
    res.status(201).json(newDocument);

  } catch (err) {
    console.error("Error creating document:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
