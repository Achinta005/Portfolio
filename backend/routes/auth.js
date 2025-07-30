const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/auth");
const Document = require("../models/Document");
const User=require('../models/Username')
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt=require('bcryptjs')

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
      return res
        .status(400)
        .json({ error: "Title and content are required fields." });
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

router.get("/google", (req, res) => {
  const redirectUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.REDIRECT_URL}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `access_type=offline`;

  res.redirect(redirectUrl);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for access token
    const data = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URL,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = data.data.access_token;

    // Get User Info Using access token
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Create JWT token using userInfo data
    const token = jwt.sign(
      userInfo.data,
      process.env.JWT_SECRET,
      {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
  const username=userInfo.data.name;
  const password=userInfo.data.id;
  const role='editor'
  let user = await User.findOne({ username });
  if(user){
    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
    const token = jwt.sign(
          { id: user._id, username: user.username,role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        );
      res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    }
    else{
     return res.status(400).send("Username already exists with a different password.");
    }
  }
  else{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword,role });
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
  
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("OAuth failed");
  }
});

module.exports = router;
