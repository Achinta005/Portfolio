const express = require('express');
const router = express.Router();
const pool = require('../config/connectSql');

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blog_data ORDER BY date DESC');

    const posts = rows.map(row => ({
      id: row.post_id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      date: row.date,
      readTime: row.readTime,
      tags: JSON.parse(row.tags)
    }));

    res.json(posts);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    res.status(500).json({ error: 'Error fetching posts', message: error.message });
  }
});

// Get a single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.execute('SELECT * FROM blog_data WHERE slug = ? LIMIT 1', [slug]);

    if (!rows.length) return res.status(404).json({ error: 'Post not found' });

    const row = rows[0];
    res.json({
      id: row.post_id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      date: row.date,
      readTime: row.readTime,
      tags: JSON.parse(row.tags)
    });
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    res.status(500).json({ error: 'Error fetching post', message: error.message });
  }
});

// Get blog posts by tag
router.get('/tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM blog_data WHERE JSON_CONTAINS(tags, ?) ORDER BY date DESC',
      [JSON.stringify(tag)]
    );

    const posts = rows.map(row => ({
      id: row.post_id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      date: row.date,
      readTime: row.readTime,
      tags: JSON.parse(row.tags)
    }));

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    res.status(500).json({ error: 'Error fetching posts by tag', message: error.message });
  }
});

module.exports = router;
