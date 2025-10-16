const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const pool=require('../config/connectSql')
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// This endpoint fetches documents and remains unchanged.
router.get("/documents", auth, async (req, res) => {

  try {
    const [rows]= await pool.execute(`SELECT * FROM documents WHERE owner = ? ORDER BY updated_at DESC`,[req.user.username])
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// POST /documents ---
router.post("/documents", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const owner_id = req.user.id;
    const owner =req.user.username;

    if (!owner) {
      console.error("FATAL: JWT payload is missing the 'id' field.", req.user);
      return res.status(403).json({ error: "Invalid token payload." });
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title and content are required fields." });
    }

    const [result]= await pool.execute(`INSERT INTO documents(owner,title,content,created_at, updated_at) VALUES(?,?,?,NOW(),NOW())`,[owner,title,content])

    // Respond with success.
    res.status(201).json(result);
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
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URL,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = data.data.access_token;

    // Get user info
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const username = userInfo.data.name;
    const password = userInfo.data.id;
    const role = "editor";

    // Check if user exists in MySQL
    const [rows] = await pool.execute(
      "SELECT * FROM usernames WHERE username = ? LIMIT 1",
      [username]
    );

    let user = rows[0];

    if (user) {
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send("Username already exists with a different password.");
      }
    } else {
      // Create new user in MySQL
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        `INSERT INTO usernames (username, password, role, version_key, created_at, updated_at)
         VALUES (?, ?, ?, 0, NOW(), NOW())`,
        [username, hashedPassword, role]
      );

      user = {
        id: result.insertId,
        username,
        role,
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("OAuth failed");
  }
});


module.exports = router;