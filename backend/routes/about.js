const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Helper function to get DB connection
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

// -------- GET: Skill data --------
router.get("/Skilldata", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const [categories] = await conn.execute("SELECT * FROM skills_categories");
    const [skills] = await conn.execute("SELECT * FROM individual_skills");

    const skills_data = categories.map((cat) => {
      const cat_skills = skills
        .filter((skill) => skill.skill_category_id === cat.id)
        .map((skill) => ({
          id: skill.skill_id,
          skill: skill.skill_name,
          category: skill.category,
          color: skill.color,
          proficiency: skill.proficiency,
          stage: skill.stage,
          description: skill.description,
          image: skill.image,
        }));

      return {
        _id: String(cat.id),
        description: cat.description,
        experienceLevel: cat.experience_level,
        title: cat.title,
        skills: cat_skills,
      };
    });

    res.status(200).json(skills_data);
  } catch (err) {
    console.error("❌ Error fetching skills:", err);
    res.status(500).json({ error: "Failed to fetch skills" });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- GET: Education data --------
router.get("/Educationdata", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM education");
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching education data:", err);
    res.status(500).json({ error: "Failed to fetch education data" });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- GET: Certificates data --------
router.get("/Certificatesdata", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM certifications");
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching certificates:", err);
    res.status(500).json({ error: "Failed to fetch certificates" });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- GET: Download resume --------
router.get("/resume", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../files/resume.pdf");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, "Achinta_Resume.pdf", (err) => {
      if (err) {
        console.error("File download error:", err);
        res
          .status(500)
          .json({ error: "Download failed", message: err.message });
      }
    });
  } catch (err) {
    console.error("File download error:", err);
    res.status(500).json({ error: "Download failed", message: err.message });
  }
});

module.exports = router;
