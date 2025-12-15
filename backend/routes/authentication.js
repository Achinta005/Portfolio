const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const connectMongoDB = require("../config/mongodb");
const User = require("../models/usermodel");

// -------- Register --------
router.post("/register", async (req, res) => {
  const { username, password, role = "viewer", email } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and Password required" });
  }

  try {
    await connectMongoDB();

    // Check for existing user
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in MongoDB
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
      email,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        role: newUser.role, 
        email: newUser.email 
      },
    });
  } catch (err) {
    console.error("Registration failed:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: err.message,
    });
  }
});

// -------- Login --------
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Username and password are required" });
  }

  try {
    await connectMongoDB();

    // Find user
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login failed:", err.message);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: err.message,
    });
  }
});


module.exports = router;