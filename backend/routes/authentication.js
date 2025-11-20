const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const SECRET_KEY = process.env.ADMIN_GRANT_KEY || "default_admin_grant_key";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const getMySQLConnection = require("../config/mysqldb");
const connectMongoDB = require("../config/mongodb");
const User = require("../models/usermodel");
const AdminIPModel = require("../models/adminIp");

// -------- Register --------
router.post("/register", async (req, res) => {
  const { username, password, role = "viewer", email } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and Password required" });
  }

  await connectMongoDB();

  let mysqlConn;
  let newUserId;

  try {
    mysqlConn = await getMySQLConnection();

    // Check MySQL duplicates
    const [existing] = await mysqlConn.execute(
      "SELECT username FROM usernames WHERE username = ? LIMIT 1",
      [username]
    );
    if (existing.length) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // MySQL insert first
    const [result] = await mysqlConn.execute(
      "INSERT INTO usernames (username, password, role, version_key, created_at, updated_at, Email) VALUES (?, ?, ?, 0, NOW(), NOW(), ?)",
      [username, hashedPassword, role, email]
    );

    newUserId = result.insertId;

    // MongoDB insert (upsert allows retry safely)
    const mongoWrite = await User.updateOne(
      { _id: newUserId },
      {
        $set: {
          _id: newUserId,
          username,
          password: hashedPassword,
          role,
          email,
          created_at: new Date(),
          updated_at: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: newUserId, username, role, email },
      stored_in: ["mysql", "mongodb"],
      fallback: mongoWrite.upsertedCount === 0 ? true : false,
    });
  } catch (err) {
    console.error("Registration failed:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: err.message,
      stored_in: ["mysql only"],
    });
  } finally {
    if (mysqlConn) await mysqlConn.end();
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

  await connectMongoDB();

  let mysqlConn;
  let mysqlLogin, mongoLogin;

  try {
    // MySQL login function (not executed yet)
    mysqlLogin = async () => {
      mysqlConn = await getMySQLConnection();

      const [rows] = await mysqlConn.execute(
        "SELECT id, username, password, role FROM usernames WHERE username = ? LIMIT 1",
        [username]
      );
      if (!rows.length) throw new Error("No MySQL user");

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Invalid credentials");

      return {
        db: "mysql",
        id: user.id,
        username: user.username,
        role: user.role,
      };
    };

    // Mongo login function
    mongoLogin = async () => {
      const user = await User.findOne({ username }).lean();
      if (!user) throw new Error("No Mongo user");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Invalid credentials");

      return {
        db: "mongodb",
        id: user._id,
        username: user.username,
        role: user.role,
      };
    };

    // Race both logins
    const fastest = await Promise.race([mysqlLogin(), mongoLogin()]);

    const token = jwt.sign(
      {
        id: fastest.id,
        username: fastest.username,
        role: fastest.role,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: fastest,
      from: fastest.db,
    });
  } catch (err) {
    console.warn("Fastest DB login failed:", err.message);

    try {
      let fallbackResult;
      if (err.message.includes("MySQL") || err.message.includes("No MySQL")) {
        fallbackResult = await mongoLogin();
      } else {
        fallbackResult = await mysqlLogin();
      }

      const token = jwt.sign(
        {
          id: fallbackResult.id,
          username: fallbackResult.username,
          role: fallbackResult.role,
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful (fallback)",
        token,
        user: fallbackResult,
        from: fallbackResult.db,
        fallback: true,
      });
    } catch (err2) {
      console.error("Both DB login failed:", err2.message);
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }
  } finally {
    if (mysqlConn) await mysqlConn.end();
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
  if (!code)
    return res.status(400).json({ error: "Missing authorization code" });

  await connectMongoDB();
  let mysqlConn;

  try {
    //Exchange auth code → Access Token
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

    //Fetch Google Profile
    const userInfoResp = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { name: username, id: googleId, email } = userInfoResp.data;

    const role = "editor";
    const password = googleId;

    mysqlConn = await getMySQLConnection();

    //Check MySQL
    const [existingUsers] = await mysqlConn.execute(
      "SELECT id, username, role FROM usernames WHERE username = ? LIMIT 1",
      [username]
    );

    let user = existingUsers[0];
    let mongoUser;

    if (!user) {
      const hashedPw = await bcrypt.hash(password, 10);

      // Insert MySQL User
      const [result] = await mysqlConn.execute(
        "INSERT INTO usernames (username, password, role, version_key, created_at, updated_at, Email) VALUES (?, ?, ?, 0, NOW(), NOW(), ?)",
        [username, hashedPw, role, email]
      );

      const newUserId = result.insertId;

      // Insert MongoDB User with SAME ID
      mongoUser = await User.create({
        _id: newUserId,
        username,
        password: hashedPw,
        email,
        role,
        created_at: new Date(),
        updated_at: new Date(),
      });

      user = { id: newUserId, username, role };
    } else {
      // User found in MySQL → fetch Mongo copy
      mongoUser = await User.findOne({ _id: user.id });

      // If missing in Mongo → create copy
      if (!mongoUser) {
        await User.create({
          _id: user.id,
          username,
          email,
          password: await bcrypt.hash(password, 10),
          role,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    //Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const redirect_url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login?token=${token}`;
    return res.redirect(redirect_url);
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return res.status(500).json({
      error: "OAuth error or server failure",
      details: err.message,
    });
  } finally {
    if (mysqlConn) await mysqlConn.end();
  }
});

// -------- Get Client IP --------
const getClientIP = async (req) => {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.headers["x-real-ip"];
  if (!ip || ["::1", "127.0.0.1"].includes(ip)) {
    try {
      const resp = await axios.get("https://api.ipify.org?format=json", {
        timeout: 2000,
      });
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
  if (!ip) {
    return res
      .status(400)
      .json({ allowed: false, error: "Unable to detect IP address" });
  }
  console.log("IP",ip)

  await connectMongoDB();
  let mysqlConn;

  try {
    // MySQL Check Promise
    const mysqlCheck = (async () => {
      mysqlConn = await getMySQLConnection();
      const [rows] = await mysqlConn.execute(
        "SELECT 1 FROM admin_ipaddress WHERE ipaddress = ? LIMIT 1",
        [ip]
      );
      if (!rows.length) throw new Error("Not allowed in MySQL");
      return true;
    })();

    // MongoDB Check Promise
    const mongoCheck = (async () => {
      const exists = await AdminIPModel.findOne({ ip });
      if (!exists) throw new Error("Not allowed in MongoDB");
      return true;
    })();

    // Race first DB
    const fastest = await Promise.race([mysqlCheck, mongoCheck]);

    // Access token (10 mins)
    const token = jwt.sign({ purpose: "admin_access", ip }, SECRET_KEY, {
      expiresIn: "10m",
    });

    return res.json({
      allowed: true,
      token,
      expires_in: 600,
      from: fastest ? "mysql/mongodb" : "unknown", // fastest DB source not needed here
    });
  } catch (err) {
    console.warn("Fastest DB rejected:", err.message);

    // 2nd Attempt: fallback (if the other DB is allowed)
    try {
      const mongoFallback = await AdminIPModel.findOne({ ip });
      const mysqlFallback = await (async () => {
        const conn = await getMySQLConnection();
        const [rows] = await conn.execute(
          "SELECT 1 FROM admin_ipaddress WHERE ipaddress = ? LIMIT 1",
          [ip]
        );
        await conn.end();
        return rows.length > 0 ? true : false;
      })();

      if (!mongoFallback && !mysqlFallback) {
        return res.status(403).json({ allowed: false });
      }

      const token = jwt.sign({ purpose: "admin_access", ip }, SECRET_KEY, {
        expiresIn: "10m",
      });

      return res.json({
        allowed: true,
        token,
        expires_in: 600,
        fallback: true,
      });
    } catch (err2) {
      console.error("Access check failed:", err2.message);
      return res.status(403).json({ allowed: false });
    }
  } finally {
    if (mysqlConn) await mysqlConn.end();
  }
});

module.exports = router;