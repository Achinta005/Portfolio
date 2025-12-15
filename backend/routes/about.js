const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const { getCache, setCache } = require("../utils/cache");

const connectMongoDB = require("../config/mongodb");

// Mongo models
const SkillCategoryMongo = require("../models/skillCategory");
const IndividualSkillMongo = require("../models/individualSkill");
const EducationMongo = require("../models/education");
const CertificateMongo = require("../models/certificate");

// ===================================================================
// 📌 GET SKILL DATA
// ===================================================================
router.get("/Skilldata", async (req, res) => {
  console.log("\n[GET] /Skilldata");

  const CACHE_KEY = "skill_data";

  // 1️⃣ RETURN FROM CACHE IF AVAILABLE
  const cached = getCache(CACHE_KEY);
  if (cached) {
    console.log("✔ Returning Skill Data from CACHE");
    return res.json(cached);
  }

  try {
    await connectMongoDB();

    const categories = await SkillCategoryMongo.find();
    const skills = await IndividualSkillMongo.find();

    console.log("MongoDB categories:", categories.length);
    console.log("MongoDB skills:", skills.length);

    const result = categories.map((cat) => ({
      _id: cat._id,
      title: cat.title,
      description: cat.description,
      experienceLevel: cat.experience_level,
      skills: skills.filter(
        (s) => String(s.skill_category_id) === String(cat._id)
      ),
    }));

    // 2️⃣ STORE IN CACHE IF DATA EXISTS
    if (result.length > 0) {
      setCache(CACHE_KEY, result);
      console.log("✔ Skill Data stored in CACHE");
    } else {
      console.log("⚠ Not caching empty data");
    }

    return res.json(result);
  } catch (err) {
    console.error("Failed to fetch skills:", err);
    return res.status(500).json({ 
      error: "Failed to fetch skills",
      message: err.message 
    });
  }
});

// ===================================================================
// 📌 GET EDUCATION DATA
// ===================================================================
router.get("/Educationdata", async (req, res) => {
  console.log("\n[GET] /Educationdata");

  const CACHE_KEY = "education_data";

  // 1️⃣ TRY CACHE FIRST
  const cached = getCache(CACHE_KEY);
  if (cached) {
    console.log("✔ Returning Education from CACHE");
    return res.json(cached);
  }

  try {
    await connectMongoDB();

    const docs = await EducationMongo.find();

    console.log("MongoDB education docs:", docs.length);

    // 2️⃣ CACHE ONLY IF DATA EXISTS
    if (docs.length > 0) {
      setCache(CACHE_KEY, docs);
      console.log("✔ Education data CACHED");
    } else {
      console.log("⚠ Not caching EMPTY education data");
    }

    return res.json(docs);
  } catch (err) {
    console.error("Failed to fetch education:", err);
    return res.status(500).json({ 
      error: "Failed to fetch education",
      message: err.message 
    });
  }
});

// ===================================================================
// 📌 GET CERTIFICATES DATA
// ===================================================================
router.get("/Certificatesdata", async (req, res) => {
  console.log("\n[GET] /Certificatesdata");

  const CACHE_KEY = "certificates_data";

  // 1️⃣ TRY CACHE FIRST
  const cached = getCache(CACHE_KEY);
  if (cached) {
    console.log("✔ Returning Certificates from CACHE");
    return res.json(cached);
  }

  try {
    await connectMongoDB();

    const docs = await CertificateMongo.find();

    console.log("MongoDB certificates docs:", docs.length);

    // 2️⃣ CACHE ONLY IF DATA EXISTS
    if (docs.length > 0) {
      setCache(CACHE_KEY, docs);
      console.log("✔ Certificates data CACHED");
    } else {
      console.log("⚠ Not caching EMPTY certificates data");
    }

    return res.json(docs);
  } catch (err) {
    console.error("Failed to fetch certificates:", err);
    return res.status(500).json({ 
      error: "Failed to fetch certificates",
      message: err.message 
    });
  }
});

// ===================================================================
// 📌 DOWNLOAD RESUME
// ===================================================================
router.get("/resume", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../files/resume.pdf");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Resume file not found" });
    }

    res.download(filePath, "Achinta_Resume.pdf");
  } catch (err) {
    console.error("❌ Error downloading resume:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

module.exports = router;