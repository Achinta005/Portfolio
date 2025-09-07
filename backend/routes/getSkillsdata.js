const express = require("express");
const router = express.Router();
const SkillModelSchema = require("../models/Skill");

router.get("/getskillsdata", async (req, res) => {
  try {
    const skillsData = await SkillModelSchema.find();
    res.status(200).json(skillsData);
  } catch (error) {
    console.error("Error fetching SkillData:", error);
    res.status(500).json({ error: "Failed to fetch SkillData" });
  }
});

module.exports = router;