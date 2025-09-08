const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog');

// Get all blog posts (sorted by date, newest first)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all blog posts...');
    
    // Get document count for debugging
    const count = await BlogPost.countDocuments({});
    console.log(`Total documents in collection: ${count}`);
    
    if (count === 0) {
      console.log('No documents found in blog collection');
      return res.json([]);
    }
    
    const posts = await BlogPost.getAllPosts();
    
    console.log(`Retrieved ${posts.length} posts from database`);
    console.log(`Returning ${posts.length} transformed posts`);
    
    res.json(posts);
  } catch (error) {
    console.error('Error in get all posts:', error);
    res.status(500).json({ 
      error: 'Error fetching posts',
      message: error.message 
    });
  }
});

// Get a single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`Looking for post with slug: ${slug}`);
    
    const post = await BlogPost.getPostBySlug(slug);
    
    if (!post) {
      console.log(`No post found with slug: ${slug}`);
      return res.status(404).json({ error: 'Post not found' });
    }
    
    console.log(`Found post: ${post.title}`);
    res.json(post);
  } catch (error) {
    console.error('Error in get post by slug:', error);
    res.status(500).json({ 
      error: 'Error fetching post',
      message: error.message 
    });
  }
});

// Get blog posts by tag
router.get('/tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    console.log(`Looking for posts with tag: ${tag}`);
    
    const posts = await BlogPost.getPostsByTag(tag);
    
    console.log(`Found ${posts.length} posts with tag: ${tag}`);
    res.json(posts);
  } catch (error) {
    console.error('Error in get posts by tag:', error);
    res.status(500).json({ 
      error: 'Error fetching posts by tag',
      message: error.message 
    });
  }
});

module.exports = router;