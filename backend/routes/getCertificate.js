const express = require("express");
const router = express.Router();
const certificateModelSchema = require("../models/certificates");

router.get("/getcertificate", async (req, res) => {
  try {
    const certificates = await certificateModelSchema.find();
    res.status(200).json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

module.exports = router;