const express = require("express");
const router = express.Router();
const pool=require('../config/connectSql');

router.get("/geteducationdata", async (req, res) => {
  try {
    const [result]=await pool.execute(`select * from education`)
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching educationData:", error);
    res.status(500).json({ error: "Failed to fetch educationData" });
  }
});

module.exports = router;