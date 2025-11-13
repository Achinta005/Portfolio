const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

// Multer setup for handling multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

// MySQL connection helper
const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: true // verify server certificate
    }
  });
};


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------- GET all projects --------
router.get("/projects_data", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM project_model ORDER BY order_position DESC");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects", message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- POST upload a project --------
router.post("/project_upload", upload.single("image"), async (req, res) => {
  let conn;
  try {
    const file = req.file;
    const { category, title, technologies, liveUrl, githubUrl, description, order } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "Uploaded_Images", resource_type: "image" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        const image_url = result.secure_url;

        // Convert technologies string to JSON array
        const json_technologies = technologies
          ? JSON.stringify(technologies.split(",").map((tech) => tech.trim()).filter(Boolean))
          : "[]";

        // Insert into DB
        conn = await getConnection();
        const [insertResult] = await conn.execute(
          `INSERT INTO project_model 
           (title, description, category, technologies, github_url, live_url, image, order_position, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [title, description, category, json_technologies, githubUrl, liveUrl, image_url, order]
        );

        res.status(200).json({
          message: "Uploaded successfully",
          project_id: insertResult.insertId,
        });
      }
    );

    // Write the buffer to the upload_stream
    uploadResult.end(file.buffer);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

module.exports = router;
