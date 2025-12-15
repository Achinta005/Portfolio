const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const { getCache, setCache, clearCache } = require("../utils/cache");

const connectMongoDB = require("../config/mongodb");
const ProjectModelMongo = require("../models/projectmodel");

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =======================================================================
// 📌 GET PROJECTS
// =======================================================================
router.get("/projects_data", async (req, res) => {
  console.log("\n[GET] /projects_data");

  const CACHE_KEY = "projects_data";

  // 1️⃣ RETURN FROM CACHE IF AVAILABLE
  const cached = getCache(CACHE_KEY);
  if (cached) {
    console.log("✔ Returning Projects from CACHE");
    return res.status(200).json({
      from: "cache",
      data: cached,
    });
  }

  try {
    await connectMongoDB();
    console.log("MongoDB connected");

    const docs = await ProjectModelMongo.find().sort({ order: -1 });

    console.log("MongoDB projects:", docs.length);

    // 2️⃣ CACHE ONLY IF DATA EXISTS
    if (Array.isArray(docs) && docs.length > 0) {
      setCache(CACHE_KEY, docs);
      console.log("✔ Projects data CACHED");
    } else {
      console.log("⚠ Not caching EMPTY result");
    }

    // 3️⃣ SEND RESPONSE
    return res.status(200).json({
      data: docs,
    });
  } catch (err) {
    console.log("❌ GET Error:", err.message);
    return res.status(500).json({
      error: "Failed to fetch projects",
      message: err.message,
    });
  }
});

// =======================================================================
// 📌 POST PROJECT UPLOAD
// =======================================================================
router.post("/project_upload", upload.single("image"), async (req, res) => {
  console.log("\n[POST] /project_upload");

  try {
    await connectMongoDB();
    console.log("MongoDB connected");

    const {
      title,
      description,
      category,
      technologies,
      githubUrl,
      liveUrl,
      order,
    } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    cloudinary.uploader
      .upload_stream(
        { folder: "Uploaded_Images", resource_type: "image" },
        async (error, result) => {
          if (error) {
            console.log("❌ Cloudinary upload error:", error.message);
            return res.status(500).json({ error: error.message });
          }

          const image_url = result.secure_url;
          const techList = technologies
            ? technologies.split(",").map((t) => t.trim())
            : [];

          try {
            // MongoDB Insert
            const doc = await ProjectModelMongo.create({
              title,
              description,
              category,
              technologies: techList,
              githubUrl,
              liveUrl,
              image: image_url,
              order,
            });

            console.log("✔ MongoDB insert:", doc._id);

            // CLEAR CACHE because new project added
            clearCache();
            console.log("✔ Cache Cleared After Upload");

            res.status(200).json({
              message: "Project stored successfully",
              project_id: doc._id,
            });
          } catch (err) {
            console.log("❌ MongoDB insert error:", err.message);
            res.status(500).json({ 
              error: "Failed to store project",
              message: err.message 
            });
          }
        }
      )
      .end(file.buffer);
  } catch (err) {
    console.log("❌ POST Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;