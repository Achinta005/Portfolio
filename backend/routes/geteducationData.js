const express = require("express");
const router = express.Router();
const educationModelSchema = require("../models/Education");

router.get("/geteducationdata", async (req, res) => {
  try {
    const educationData = await educationModelSchema.find();
    res.status(200).json(educationData);
  } catch (error) {
    console.error("Error fetching educationData:", error);
    res.status(500).json({ error: "Failed to fetch educationData" });
  }
});

module.exports = router;