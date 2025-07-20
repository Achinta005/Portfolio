const express = require('express');
const router = express.Router();
const projectModel = require('../models/projectModel');

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await projectModel.find({}).sort({ order: 1 });
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

module.exports = router;
