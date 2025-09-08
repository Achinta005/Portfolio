const mongoose = require('mongoose');

// Blog Post Schema - matching your existing database structure
const blogPostSchema = new mongoose.Schema({
  post_id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  readTime: {
    type: String,
    default: '5 min'
  },
  tags: [{
    type: String,
    trim: true
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Blog_data'
});

// Utility functions for data transformation
blogPostSchema.methods.toResponseFormat = function() {
  return {
    id: this.post_id,
    title: this.title,
    slug: this.slug,
    excerpt: this.excerpt,
    content: this.content,
    date: this.date,
    readTime: this.readTime,
    tags: this.tags
  };
};

// Static methods for blog operations
blogPostSchema.statics.getNextPostId = async function() {
  try {
    const lastPost = await this.findOne({}).sort({ post_id: -1 });
    return lastPost ? lastPost.post_id + 1 : 1;
  } catch (error) {
    console.error('Error getting next post ID:', error);
    return 1;
  }
};

blogPostSchema.statics.generateSlug = function(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

blogPostSchema.statics.createPost = async function(postData) {
  try {
    const postId = await this.getNextPostId();
    let slug = postData.slug || this.generateSlug(postData.title);
    
    // Check if slug already exists
    const existingPost = await this.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${postId}`;
    }
    
    const blogDoc = {
      post_id: postId,
      title: postData.title,
      slug,
      excerpt: postData.excerpt,
      content: postData.content,
      date: postData.date || new Date().toISOString(),
      readTime: postData.readTime || '5 min',
      tags: postData.tags || [],
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const newPost = new this(blogDoc);
    await newPost.save();
    return newPost.toResponseFormat();
  } catch (error) {
    throw new Error(`Error creating blog post: ${error.message}`);
  }
};

blogPostSchema.statics.getAllPosts = async function() {
  try {
    const posts = await this.find({}).sort({ date: -1 });
    return posts.map(post => post.toResponseFormat());
  } catch (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
};

blogPostSchema.statics.getPostBySlug = async function(slug) {
  try {
    const post = await this.findOne({ slug });
    return post ? post.toResponseFormat() : null;
  } catch (error) {
    throw new Error(`Error fetching post: ${error.message}`);
  }
};

blogPostSchema.statics.getPostsByTag = async function(tag) {
  try {
    const posts = await this.find({ tags: { $in: [tag] } }).sort({ date: -1 });
    return posts.map(post => post.toResponseFormat());
  } catch (error) {
    throw new Error(`Error fetching posts by tag: ${error.message}`);
  }
};

blogPostSchema.statics.createMultiplePosts = async function(postsData) {
  try {
    const createdPosts = [];
    
    for (const postData of postsData) {
      const createdPost = await this.createPost(postData);
      createdPosts.push(createdPost);
    }
    
    return createdPosts;
  } catch (error) {
    throw new Error(`Error creating multiple posts: ${error.message}`);
  }
};

// Update the updated_at field before saving
blogPostSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  next();
});

const BlogPost = mongoose.model('Blog_data', blogPostSchema);

module.exports = BlogPost;