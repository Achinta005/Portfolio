const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectMongoDB = require("../config/mongodb");

// Mongo models
const SkillCategoryMongo = require("../models/skillCategory");
const IndividualSkillMongo = require("../models/individualSkill");
const EducationMongo = require("../models/education");
const CertificateMongo = require("../models/certificate");

// MySQL Helper
const getMySQLConnection = require('../config/mysqldb')

// ===================================================================
// 📌 GET SKILL DATA (fastest of MySQL + MongoDB)
// ===================================================================
router.get("/Skilldata", async (req, res) => {
  console.log("\n[GET] /Skilldata");

  try {
    await connectMongoDB();

    const mysqlPromise = new Promise(async (resolve, reject) => {
      try {
        const conn = await getMySQLConnection();

        const [categories] = await conn.execute("SELECT * FROM skills_categories");
        const [skills] = await conn.execute("SELECT * FROM individual_skills");

        const result = categories.map((cat) => ({
          _id: String(cat.id),
          title: cat.title,
          description: cat.description,
          experienceLevel: cat.experience_level,
          skills: skills
            .filter((s) => s.skill_category_id === cat.id)
            .map((s) => ({
              id: s.skill_id,
              skill: s.skill_name,
              category: s.category,
              color: s.color,
              proficiency: s.proficiency,
              stage: s.stage,
              description: s.description,
              image: s.image,
            })),
        }));

        resolve({ source: "mysql", data: result });
      } catch (err) {
        reject({ source: "mysql", error: err });
      }
    });

    const mongoPromise = new Promise(async (resolve, reject) => {
      try {
        const categories = await SkillCategoryMongo.find();
        const skills = await IndividualSkillMongo.find();

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

    // RACE
    let fastest;
    try {
      fastest = await Promise.race([mysqlPromise, mongoPromise]);
      console.log("✔ Fastest DB:", fastest.source);
      return res.json(fastest.data);
    } catch (err) {
      console.log("⚠ Fastest DB failed:", err.source);

      const fallback =
        err.source === "mysql" ? await mongoPromise : await mysqlPromise;

      console.log("✔ Fallback DB:", fallback.source);
      console.log("data:",fallback.data)
      return res.json(fallback.data);
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// ===================================================================
// 📌 GET EDUCATION DATA
// ===================================================================
router.get("/Educationdata", async (req, res) => {
  console.log("\n[GET] /Educationdata");

  try {
    await connectMongoDB();

    const mysqlPromise = new Promise(async (resolve, reject) => {
      try {
        const conn = await getMySQLConnection();
        const [rows] = await conn.execute("SELECT * FROM education");
        resolve({ source: "mysql", data: rows });
      } catch (err) {
        reject({ source: "mysql", error: err });
      }
    });

    const mongoPromise = EducationMongo.find()
      .then((docs) => ({ source: "mongodb", data: docs }))
      .catch((err) => Promise.reject({ source: "mongodb", error: err }));

    let fastest;
    try {
      fastest = await Promise.race([mysqlPromise, mongoPromise]);
      console.log("✔ Fastest DB:", fastest.source);
      return res.json(fastest.data);
    } catch (err) {
      const fallback =
        err.source === "mysql" ? await mongoPromise : await mysqlPromise;
      console.log("✔ Fallback DB:", fallback.source);
      return res.json(fallback.data);
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch education" });
  }
});

// ===================================================================
// 📌 GET CERTIFICATES DATA
// ===================================================================
router.get("/Certificatesdata", async (req, res) => {
  console.log("\n[GET] /Certificatesdata");

  try {
    await connectMongoDB();

    const mysqlPromise = new Promise(async (resolve, reject) => {
      try {
        const conn = await getMySQLConnection();
        const [rows] = await conn.execute("SELECT * FROM certifications");
        resolve({ source: "mysql", data: rows });
      } catch (err) {
        reject({ source: "mysql", error: err });
      }
    });

    const mongoPromise = CertificateMongo.find()
      .then((docs) => ({ source: "mongodb", data: docs }))
      .catch((err) => Promise.reject({ source: "mongodb", error: err }));

    let fastest;
    try {
      fastest = await Promise.race([mysqlPromise, mongoPromise]);
      console.log("✔ Fastest DB:", fastest.source);
      return res.json(fastest.data);
    } catch (err) {
      const fallback =
        err.source === "mysql" ? await mongoPromise : await mysqlPromise;
      console.log("✔ Fallback DB:", fallback.source);
      return res.json(fallback.data);
    }
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
