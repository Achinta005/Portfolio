const express=require('express')
const router=express.Router()
const pool=require('../config/connectSql');

router.get("/", async (req, res) => {
  try {
    const [rows]=await pool.execute(`SELECT * FROM contact_info`)
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});
module.exports=router