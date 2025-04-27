const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Merchandise = require('../models/Merchandise');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for merchandise images
const merchandiseUploadDir = path.join(__dirname, '../uploads/merchandise');
if (!fs.existsSync(merchandiseUploadDir)) {
  fs.mkdirSync(merchandiseUploadDir, { recursive: true });
}

const merchandiseStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, merchandiseUploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'merch-' + uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload instance for merchandise images
const upload = multer({
  storage: merchandiseStorage,
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

// Get all merchandise for a specific creator
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    
    const merchandise = await Merchandise.find({ creator: creatorId })
      .sort({ createdAt: -1 })
      .populate('creator', 'username profileImage');
    
    res.json({
      success: true,
      message: 'Merchandise retrieved successfully',
      data: merchandise
    });
  } catch (error) {
    console.error('Error fetching merchandise:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving merchandise',
      error: error.message
    });
  }
});

// Get a specific merchandise item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const merchandise = await Merchandise.findById(id)
      .populate('creator', 'username profileImage');
    
    if (!merchandise) {
      return res.status(404).json({
        success: false,
        message: 'Merchandise not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Merchandise retrieved successfully',
      data: merchandise
    });
  } catch (error) {
    console.error('Error fetching merchandise:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving merchandise',
      error: error.message
    });
  }
});

// Create a new merchandise item with image upload
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
      const { title, description, price } = req.body;
      
      // Validate request
      if (!title || !description || !price) {
        return res.status(400).json({
          success: false,
          message: 'Please provide title, description, and price'
        });
      }
      
      // Create new merchandise item
      const merchandise = new Merchandise({
        title,
        description,
        price: parseFloat(price),
        creator: req.user.userId,
        image: req.file ? `/uploads/merchandise/${req.file.filename}` : ''
      });
      
      await merchandise.save();
      
      res.status(201).json({
        success: true,
        message: 'Merchandise created successfully',
        data: merchandise
      });
    } catch (error) {
      console.error('Error creating merchandise:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating merchandise',
        error: error.message
      });
    }
  });
});

// Update a merchandise item
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
      const { title, description, price } = req.body;
      
      // Find merchandise
      const merchandise = await Merchandise.findById(id);
      
      if (!merchandise) {
        return res.status(404).json({
          success: false,
          message: 'Merchandise not found'
        });
      }
      
      // Check if user is the creator of the merchandise
      if (merchandise.creator.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this merchandise'
        });
      }
      
      // Update merchandise
      if (title) merchandise.title = title;
      if (description) merchandise.description = description;
      if (price) merchandise.price = parseFloat(price);
      
      // If a new image is uploaded, update the image path and delete the old one
      if (req.file) {
        if (merchandise.image) {
          const oldImagePath = path.join(__dirname, '..', merchandise.image.replace(/^\/uploads/, 'uploads'));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        merchandise.image = `/uploads/merchandise/${req.file.filename}`;
      }
      
      merchandise.updatedAt = Date.now();
      await merchandise.save();
      
      res.json({
        success: true,
        message: 'Merchandise updated successfully',
        data: merchandise
      });
    } catch (error) {
      console.error('Error updating merchandise:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating merchandise',
        error: error.message
      });
    }
  });
});

// Delete a merchandise item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find merchandise
    const merchandise = await Merchandise.findById(id);
    
    if (!merchandise) {
      return res.status(404).json({
        success: false,
        message: 'Merchandise not found'
      });
    }
    
    // Check if user is the creator of the merchandise
    if (merchandise.creator.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this merchandise'
      });
    }
    
    // Delete merchandise image if it exists
    if (merchandise.image) {
      const imagePath = path.join(__dirname, '..', merchandise.image.replace(/^\/uploads/, 'uploads'));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete merchandise
    await Merchandise.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Merchandise deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting merchandise:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting merchandise',
      error: error.message
    });
  }
});

module.exports = router;
