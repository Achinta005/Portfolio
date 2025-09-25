const express = require('express');
const router = express.Router();
const pool=require('../config/connectSql');

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const [result]=await pool.execute(`SELECT * FROM project_model ORDER BY order_position DESC`)
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

module.exports = router;