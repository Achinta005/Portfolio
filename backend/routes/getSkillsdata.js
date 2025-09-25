const express = require("express");
const router = express.Router();
const pool = require("../config/connectSql");

router.get("/getskillsdata", async (req, res) => {
  try {
    const [categories] = await pool.execute("SELECT * FROM skills_categories");
    const [skills] = await pool.execute("SELECT * FROM individual_skills");


    const skillsData = categories.map((cat) => ({
      _id: cat.id.toString(),
      description: cat.description,
      experienceLevel: cat.experience_level,
      title: cat.title,
      skills: skills
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
        })),
    }));
    res.status(200).json(skillsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

module.exports = router;
