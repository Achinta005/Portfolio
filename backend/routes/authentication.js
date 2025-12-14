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
router.get("/google-oauth", (req, res) => {
  try {
    const redirectUri = process.env.REDIRECT_URL;
    const clientId = process.env.GOOGLE_CLIENT_ID;

    // Optional platform hint (?mobile=1)
    const mobile = req.query.mobile === "1" ? "&state=mobile" : "";

    const oauthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      "&response_type=code" +
      "&scope=openid%20email%20profile" +
      "&access_type=offline" +
      "&prompt=consent" +
      mobile;

    return res.redirect(oauthUrl);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to redirect to Google OAuth",
      message: err.message,
    });
  }
});

// -------- Google OAuth Callback --------
router.get("/google_auth_callback", async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.status(400).json({ error: "Missing authorization code" });

  await connectMongoDB();
  let mysqlConn;

  try {
    // 1️⃣ Exchange code → token
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

    const accessToken = tokenResp.data.access_token;

    // 2️⃣ Fetch Google user
    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const { name: username, id: googleId, email } = googleUser;
    const role = "editor";
    const password = googleId;

    mysqlConn = await getMySQLConnection();

    // 3️⃣ MySQL user check
    const [rows] = await mysqlConn.execute(
      "SELECT id, username, role FROM usernames WHERE Email = ? LIMIT 1",
      [email]
    );

    let user = rows[0];

    if (!user) {
      const hashedPw = await bcrypt.hash(password, 10);

      const [result] = await mysqlConn.execute(
        `INSERT INTO usernames 
         (username, password, role, version_key, created_at, updated_at, Email)
         VALUES (?, ?, ?, 0, NOW(), NOW(), ?)`,
        [username, hashedPw, role, email]
      );

      const newId = result.insertId;

      await User.create({
        _id: newId,
        username,
        email,
        password: hashedPw,
        role,
      });

      user = { id: newId, username, role };
    } else {
      const mongoUser = await User.findOne({ _id: user.id });
      if (!mongoUser) {
        await User.create({
          _id: user.id,
          username,
          email,
          password: await bcrypt.hash(password, 10),
          role,
        });
      }
    }

    // 4️⃣ JWT
    const jwtToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 5️⃣ Platform detection
    const ua = (req.headers["user-agent"] || "").toLowerCase();
    const looksLikeMobile =
      ua.includes("android") || ua.includes("wv") || state === "mobile";

    // 6️⃣ Redirect
    if (looksLikeMobile) {
      const deepLink = `${process.env.APP_SCHEME}://${process.env.APP_HOST}?token=${encodeURIComponent(jwtToken)}`;
      return res.redirect(deepLink);
    }

    // Web + Electron (hosted frontend)
    const frontend = process.env.FRONTEND_WEB_URL || "https://appsy-ivory.vercel.app";
    return res.redirect(
      `${frontend}/login?token=${encodeURIComponent(jwtToken)}`
    );
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return res.status(500).json({
      error: "OAuth failed",
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

//Github OAuth
// -------- GitHub OAuth Redirect --------
router.get("/github-oAuth", (req, res) => {
  try {
    const client_id = process.env.GITHUB_CLIENT_ID;
    const redirect_uri = process.env.GITHUB_REDIRECT_URL;
    const scope = "user:email";

    const oauth_url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;

    res.redirect(oauth_url);
  } catch (err) {
    res.status(500).json({ error: "Failed to redirect", message: err.message });
  }
});

// -------- GitHub OAuth Callback --------
router.get("/github_auth_callback", async (req, res) => {
  const code = req.query.code;
  if (!code)
    return res.status(400).json({ error: "Missing authorization code" });

  await connectMongoDB();
  let mysqlConn;

  try {
    // Exchange code → Access Token
    const tokenResp = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URL,
      },
      { headers: { Accept: "application/json" } }
    );

    const access_token = tokenResp.data.access_token;
    if (!access_token) throw new Error("Invalid access token response");

    // Get GitHub profile
    const userResp = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const emailResp = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const username = userResp.data.login;
    const githubId = userResp.data.id;
    const emailObj = emailResp.data.find(e => e.primary) || emailResp.data[0];
    const email = emailObj?.email || `${username}@github.com`;

    const role = "editor";
    const password = githubId.toString();

    mysqlConn = await getMySQLConnection();

    // Check MySQL
    const [existingUsers] = await mysqlConn.execute(
      "SELECT id, username, role FROM usernames WHERE username = ? LIMIT 1",
      [username]
    );

    let user = existingUsers[0];
    let mongoUser;

    if (!user) {
      const hashedPw = await bcrypt.hash(password, 10);

      // Insert MySQL
      const [result] = await mysqlConn.execute(
        "INSERT INTO usernames (username, password, role, version_key, created_at, updated_at, Email) VALUES (?, ?, ?, 0, NOW(), NOW(), ?)",
        [username, hashedPw, role, email]
      );

      const newUserId = result.insertId;

      // Insert MongoDB
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
      // Mongo sync
      mongoUser = await User.findOne({ _id: user.id });
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

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Redirect Frontend
    const redirect_url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login?token=${token}`;
    return res.redirect(redirect_url);
  } catch (err) {
    console.error("GitHub OAuth callback failed:", err);
    return res.status(500).json({
      error: "OAuth error or server failure",
      details: err.message,
    });
  } finally {
    if (mysqlConn) await mysqlConn.end();
  }
});


module.exports = router;