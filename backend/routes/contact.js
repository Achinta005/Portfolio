const express = require("express");
const router = express.Router();
require("dotenv").config();

const getMySQLConnection = require("../config/mysqldb");
const connectMongoDB = require("../config/mongodb");
const contactSchema = require("../models/contactmodel");

// -------- POST: Submit Contact Form --------
router.post("/upload_response", async (req, res) => {
  let conn;
  try {
    await connectMongoDB();
    console.log("MongoDB Connected");

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // MySQL insert
    const mysqlPromise = (async () => {
      conn = await getMySQLConnection();
      const [insertResult] = await conn.execute(
        `INSERT INTO contact_info (name, email, subject, message, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [name, email, subject, message]
      );
      console.log("✔ MySQL insert:", insertResult.insertId);
      return { insertId: insertResult.insertId };
    })();

    // Mongo insert
    const mongoPromise = (async () => {
      const doc = await contactSchema.create({
        name,
        email,
        subject,
        message,
      });
      console.log("✔ Mongo insert:", doc._id);
      return { objectId: doc._id };
    })();

    const results = await Promise.allSettled([mysqlPromise, mongoPromise]);

    res.status(200).json({
      message: "Response submitted in both databases",
      mysql: results[0],
      mongo: results[1],
    });

  } catch (err) {
    console.error("Error submitting contact form:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- GET: Fastest DB Fetch (MySQL or Mongo) --------
router.get("/contact_responses", async (req, res) => {
  try {
    await connectMongoDB();
    console.log("MongoDB connected");

    const mysqlPromise = (async () => {
      const conn = await getMySQLConnection();
      try {
        const [rows] = await conn.execute("SELECT * FROM contact_info");
        return { source: "mysql", data: rows };
      } finally {
        await conn.end();
      }
    })();

    const mongoPromise = (async () => {
      const docs = await contactSchema.find();
      return { source: "mongodb", data: docs };
    })();

    let fastest;
    try {
      fastest = await Promise.race([mysqlPromise, mongoPromise]);
      console.log("✔ Fastest DB:", fastest.source);

      return res.status(200).json({
        from: fastest.source,
        data: fastest.data,
      });

    } catch (err) {
      console.log("⚠ Fastest DB failed:", err.source);

      const fallback =
        err.source === "mysql" ? await mongoPromise : await mysqlPromise;

      console.log("✔ Fallback DB:", fallback.source);

      return res.status(200).json({
        from: fallback.source,
        data: fallback.data,
        fallback: true,
      });
    }

  } catch (err) {
    console.error("Error fetching contact info:", err);
    res.status(500).json({
      error: "Failed to fetch contact info",
      message: err.message,
    });
  }
});

module.exports = router;