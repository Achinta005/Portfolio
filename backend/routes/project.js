const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { getCache, setCache, clearCache } = require("../utils/cache");

const connectMongoDB = require("../config/mongodb");
const ProjectModelMongo = require("../models/projectmodel");


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

module.exports = router;