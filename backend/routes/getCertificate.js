const express = require("express");
const router = express.Router();
const pool =require('../config/connectSql');

router.get("/getcertificate", async (req, res) => {
  try {
    const [result]=await pool.execute(`select * from certifications`)
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

module.exports = router;