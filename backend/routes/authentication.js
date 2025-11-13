const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const SECRET_KEY = process.env.ADMIN_GRANT_KEY || "default_admin_grant_key";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: true,
    },
  });
};

// -------- Register --------
router.post("/register", async (req, res) => {
  const { username, password, role = "viewer", email } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Username and Password required" });

  let conn;
  try {
    conn = await getConnection();
    const [existing] = await conn.execute("SELECT * FROM usernames WHERE username = ? LIMIT 1", [username]);
    if (existing.length) return res.status(400).json({ error: "User with this Username already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await conn.execute(
      "INSERT INTO usernames (username, password, role, version_key, created_at, updated_at, Email) VALUES (?, ?, ?, 0, NOW(), NOW(), ?)",
      [username, hashedPassword, role, email]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: result.insertId, username, role, version_key: 0 },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Error registering user", message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Login --------
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM usernames WHERE username = ? LIMIT 1", [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login error", message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Google OAuth Redirect --------
router.get("/google-oAuth", (req, res) => {
  try {
    const redirect_uri = process.env.REDIRECT_URL;
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const scope = "email profile";
    const oauth_url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&access_type=offline`;
    res.redirect(oauth_url);
  } catch (err) {
    res.status(500).json({ error: "Failed to redirect", message: err.message });
  }
});

// -------- Google OAuth Callback --------
router.get("/google_auth_callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing authorization code" });

  let conn;
  try {
    // Get access token
    const tokenResp = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URL,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const access_token = tokenResp.data.access_token;

    // Get user info
    const userInfoResp = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = userInfoResp.data;

    const username = userData.name;
    const password = userData.id;
    const email = userData.email;
    const role = "editor";

    conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM usernames WHERE username = ? LIMIT 1", [username]);
    let user = rows[0];

    if (!user) {
      const hashedPw = await bcrypt.hash(password, 10);
      const [result] = await conn.execute(
        "INSERT INTO usernames (username, password, role, version_key, created_at, updated_at, Email) VALUES (?, ?, ?, 0, NOW(), NOW(), ?)",
        [username, hashedPw, role, email]
      );
      user = { id: result.insertId, username, role };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET
    );
    const redirect_url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login?token=${token}`;
    res.redirect(redirect_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OAuth or server error", details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Get Client IP --------
const getClientIP = async (req) => {
  let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.headers["x-real-ip"];
  if (!ip || ["::1", "127.0.0.1"].includes(ip)) {
    try {
      const resp = await axios.get("https://api.ipify.org?format=json", { timeout: 2000 });
      ip = resp.data.ip;
    } catch {
      ip = null;
    }
  }
  return ip;
};

// -------- Check Admin Access by IP --------
router.post("/check-access", async (req, res) => {
  const ip = await getClientIP(req);
  if (!ip) return res.status(400).json({ allowed: false, error: "Unable to detect IP" });

  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT 1 FROM admin_ipaddress WHERE ipaddress = ? LIMIT 1", [ip]);
    if (!rows.length) return res.status(403).json({ allowed: false });

    const token = jwt.sign({ purpose: "admin_access", ip, exp: Math.floor(Date.now() / 1000) + 600 }, SECRET_KEY);
    res.json({ allowed: true, token, expires_in: 600 });
  } catch (err) {
    res.status(500).json({ allowed: false, error: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

module.exports = router;
