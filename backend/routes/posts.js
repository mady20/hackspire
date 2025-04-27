const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for post images
const postUploadDir = path.join(__dirname, '../uploads/posts');
if (!fs.existsSync(postUploadDir)) {
  fs.mkdirSync(postUploadDir, { recursive: true });
}

const postStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, postUploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'post-' + uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload instance for post images
const upload = multer({
  storage: postStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFileFilter
}).single('image');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-should-be-in-env-file');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get all posts for a specific creator
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    
    const posts = await Post.find({ creator: creatorId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('creator', 'username profileImage');
    
    res.json({
      success: true,
      message: 'Posts retrieved successfully',
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving posts',
      error: error.message
    });
  }
});

// Get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id)
      .populate('creator', 'username profileImage');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Post retrieved successfully',
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving post',
      error: error.message
    });
  }
});

// Create a new post with image upload
router.post('/', authenticateToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Error uploading image',
        error: err.message
      });
    }
    
    try {
      const { title, content } = req.body;
      
      // Validate request
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Please provide title and content'
        });
      }
      
      // Create new post
      const post = new Post({
        title,
        content,
        creator: req.user.userId,
        image: req.file ? `/uploads/posts/${req.file.filename}` : ''
      });
      
      await post.save();
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating post',
        error: error.message
      });
    }
  });
});

// Update a post with image upload
router.put('/:id', authenticateToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Error uploading image',
        error: err.message
      });
    }
    
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      
      // Validate request
      if (!title && !content && !req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please provide title, content, or an image to update'
        });
      }
      
      // Find post
      const post = await Post.findById(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Check if user is the creator of the post
      if (post.creator.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this post'
        });
      }
      
      // Update post
      if (title) post.title = title;
      if (content) post.content = content;
      
      // If a new image is uploaded, update the image path and delete the old one
      if (req.file) {
        if (post.image) {
          const oldImagePath = path.join(__dirname, '..', post.image.replace(/^\/uploads/, 'uploads'));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        post.image = `/uploads/posts/${req.file.filename}`;
      }
      
      post.updatedAt = Date.now();
      
      await post.save();
      
      res.json({
        success: true,
        message: 'Post updated successfully',
        data: post
      });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating post',
        error: error.message
      });
    }
  });
});

// Delete a post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find post
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is the creator of the post
    if (post.creator.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post'
      });
    }
    
    // Delete post image if it exists
    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image.replace(/^\/uploads/, 'uploads'));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete post
    await Post.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
});

module.exports = router;
