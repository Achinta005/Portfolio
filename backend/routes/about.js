const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
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

// MySQL Helper
const getMySQLConnection = require("../config/mysqldb");

// ===================================================================
// 📌 GET SKILL DATA (fastest of MySQL + MongoDB)
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

    // ================================
    // MySQL PROMISE
    // ================================
    const mysqlPromise = new Promise(async (resolve, reject) => {
      try {
        const conn = await getMySQLConnection();

        const [categories] = await conn.execute(
          "SELECT * FROM skills_categories"
        );
        const [skills] = await conn.execute("SELECT * FROM individual_skills");

        console.log("MySQL categories:", categories.length);
        console.log("MySQL skills:", skills.length);

        const result = categories.map((cat) => ({
          _id: String(cat.id),
          title: cat.title,
          description: cat.description,
          experienceLevel: cat.experience_level,
          skills: skills.filter((s) => s.skill_category_id === cat.id),
        }));

        resolve({ source: "mysql", data: result });
      } catch (err) {
        reject({ source: "mysql", error: err });
      }
    });

    // ================================
    // Mongo PROMISE
    // ================================
    const mongoPromise = new Promise(async (resolve, reject) => {
      try {
        const categories = await SkillCategoryMongo.find();
        const skills = await IndividualSkillMongo.find();

        console.log("Mongo categories:", categories.length);
        console.log("Mongo skills:", skills.length);

        const result = categories.map((cat) => ({
          _id: cat._id,
          title: cat.title,
          description: cat.description,
          experienceLevel: cat.experience_level,
          skills: skills.filter((s) => s.skill_category_id === cat._id),
        }));

        resolve({ source: "mongodb", data: result });
      } catch (err) {
        reject({ source: "mongodb", error: err });
      }
    });

    // ================================
    // RACE: FASTEST DB RESPONDS FIRST
    // ================================
    let fastest = await Promise.race([mysqlPromise, mongoPromise]);
    console.log("✔ Fastest DB:", fastest.source);

    // 2️⃣ FIX: If Mongo returns EMPTY → use MySQL instead
    if (fastest.source === "mongodb" && fastest.data.length === 0) {
      console.log("⚠ Mongo empty → forcing MySQL");
      fastest = await mysqlPromise;
    }

    // 3️⃣ FINAL FALLBACK IF STILL EMPTY
    if (fastest.data.length === 0) {
      const fallback =
        fastest.source === "mysql" ? await mongoPromise : await mysqlPromise;

      console.log("✔ Fallback DB:", fallback.source);
      fastest = fallback;
    }

    // 4️⃣ STORE ONLY IF DATA EXISTS
    if (fastest.data.length > 0) {
      setCache(CACHE_KEY, fastest.data);
      console.log("✔ Skill Data stored in CACHE");
    } else {
      console.log("⚠ Not caching empty data");
    }

    return res.json(fastest.data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch skills" });
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

    // ------------------------------
    // MySQL promise
    // ------------------------------
    const mysqlPromise = new Promise(async (resolve, reject) => {
      try {
        const conn = await getMySQLConnection();
        const [rows] = await conn.execute("SELECT * FROM education");

        console.log("MySQL education rows:", rows.length);

        resolve({ source: "mysql", data: rows });
      } catch (err) {
        reject({ source: "mysql", error: err });
      }
    });

    // ------------------------------
    // Mongo promise
    // ------------------------------
    const mongoPromise = new Promise(async (resolve, reject) => {
      try {
        const docs = await EducationMongo.find();

        console.log("Mongo education docs:", docs.length);

        resolve({ source: "mongodb", data: docs });
      } catch (err) {
        reject({ source: "mongodb", error: err });
      }
    });

    // RACE
    let fastest = await Promise.race([mysqlPromise, mongoPromise]);

    console.log("✔ Fastest DB:", fastest.source);

    // 2️⃣ If result empty → fallback to other DB
    if (fastest.data.length === 0) {
      console.log("⚠ Empty education result → trying fallback DB");

      const fallback =
        fastest.source === "mysql" ? await mongoPromise : await mysqlPromise;

      console.log("✔ Fallback DB:", fallback.source);
      fastest = fallback;
    }

    // 3️⃣ CACHE ONLY IF DATA EXISTS
    if (fastest.data.length > 0) {
      setCache(CACHE_KEY, fastest.data);
      console.log("✔ Education data CACHED");
    } else {
      console.log("⚠ Not caching EMPTY education data");
    }

    return res.json(fastest.data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch education" });
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

    // ------------------------------
    // MySQL promise
    // ------------------------------
    const mysqlPromise = new Promise(async (resolve, reject) => {
      try {
        const conn = await getMySQLConnection();
        const [rows] = await conn.execute("SELECT * FROM certifications");

        console.log("MySQL certificates rows:", rows.length);

        resolve({ source: "mysql", data: rows });
      } catch (err) {
        reject({ source: "mysql", error: err });
      }
    });

    // ------------------------------
    // Mongo promise
    // ------------------------------
    const mongoPromise = new Promise(async (resolve, reject) => {
      try {
        const docs = await CertificateMongo.find();

        console.log("Mongo certificates docs:", docs.length);

        resolve({ source: "mongodb", data: docs });
      } catch (err) {
        reject({ source: "mongodb", error: err });
      }
    });

    // RACE
    let fastest = await Promise.race([mysqlPromise, mongoPromise]);

    console.log("✔ Fastest DB:", fastest.source);

    // 2️⃣ Fallback if empty
    if (fastest.data.length === 0) {
      console.log("⚠ Empty certificates result → trying fallback DB");

      const fallback =
        fastest.source === "mysql" ? await mongoPromise : await mysqlPromise;

      console.log("✔ Fallback DB:", fallback.source);
      fastest = fallback;
    }

    // 3️⃣ CACHE ONLY IF DATA EXISTS
    if (fastest.data.length > 0) {
      setCache(CACHE_KEY, fastest.data);
      console.log("✔ Certificates data CACHED");
    } else {
      console.log("⚠ Not caching EMPTY certificates data");
    }

    return res.json(fastest.data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch certificates" });
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
