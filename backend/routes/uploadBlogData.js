const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog');

// Validation middleware for blog post data
const validateBlogPostData = (req, res, next) => {
  const { title, excerpt, content } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  
  if (!excerpt || typeof excerpt !== 'string' || excerpt.trim() === '') {
    return res.status(400).json({ error: 'Excerpt is required and must be a non-empty string' });
  }
  
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
  }
  
  // Validate tags if provided
  if (req.body.tags && !Array.isArray(req.body.tags)) {
    return res.status(400).json({ error: 'Tags must be an array' });
  }
  
  next();
};

// Create a new blog post
router.post('/posts', validateBlogPostData, async (req, res) => {
  try {
    console.log('Creating new blog post...');
    console.log('Post data:', { title: req.body.title, tags: req.body.tags });
    
    const createdPost = await BlogPost.createPost(req.body);
    
    console.log(`Successfully created post with ID: ${createdPost.id}`);
    res.status(201).json(createdPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ 
      error: 'Error creating blog post',
      message: error.message 
    });
  }
});

module.exports = router;