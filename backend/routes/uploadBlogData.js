const express = require('express');
const router = express.Router();
const pool = require('../config/connectSql');

// Validation middleware for blog post data
const validateBlogPostData = (req, res, next) => {
  const { title, excerpt, content, tags } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }

  if (!excerpt || typeof excerpt !== 'string' || excerpt.trim() === '') {
    return res.status(400).json({ error: 'Excerpt is required and must be a non-empty string' });
  }

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
  }

  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ error: 'Tags must be an array' });
  }

  next();
};

// Create a new blog post
router.post('/posts', validateBlogPostData, async (req, res) => {
  try {
    const { title, excerpt, content, tags, date, readTime, slug } = req.body;

    // Get next post_id
    const [lastPost] = await pool.execute('SELECT post_id FROM blog_data ORDER BY post_id DESC LIMIT 1');
    const nextPostId = lastPost.length ? lastPost[0].post_id + 1 : 1;

    // Generate slug if not provided
    let finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists
    const [existingSlug] = await pool.execute('SELECT id FROM blog_data WHERE slug = ?', [finalSlug]);
    if (existingSlug.length) finalSlug = `${finalSlug}-${nextPostId}`;

    const tagsJSON = JSON.stringify(tags || []);

    const [result] = await pool.execute(
      `INSERT INTO blog_data
      (post_id, title, content, excerpt, slug, tags, date, readTime, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [nextPostId, title, content, excerpt, finalSlug, tagsJSON, date || new Date().toISOString(), readTime || '5 min']
    );

    res.status(201).json({
      id: nextPostId,
      title,
      slug: finalSlug,
      excerpt,
      content,
      date,
      readTime,
      tags: tags || []
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Error creating blog post', message: error.message });
  }
});

module.exports = router;
