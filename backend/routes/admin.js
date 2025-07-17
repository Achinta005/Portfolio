const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Protected admin routes
router.use(authenticateToken);

router.get('/dashboard', (req, res) => {
  res.json({ 
    message: 'Welcome to admin dashboard',
    user: req.user.username 
  });
});

// Add more admin routes here
router.get('/users', (req, res) => {
  res.json({ message: 'Admin users endpoint' });
});

module.exports = router;