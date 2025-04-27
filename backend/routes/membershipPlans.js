const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');

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

// Get all membership plans for a specific creator
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    
    const plans = await MembershipPlan.find({ creator: creatorId })
      .sort({ price: 1 }) // Sort by price (lowest first)
      .populate('creator', 'username profileImage');
    
    res.json({
      success: true,
      message: 'Membership plans retrieved successfully',
      data: plans
    });
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving membership plans',
      error: error.message
    });
  }
});

// Get a specific membership plan by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await MembershipPlan.findById(id)
      .populate('creator', 'username profileImage');
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Membership plan retrieved successfully',
      data: plan
    });
  } catch (error) {
    console.error('Error fetching membership plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving membership plan',
      error: error.message
    });
  }
});

// Create a new membership plan
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, benefits } = req.body;
    
    // Validate request
    if (!title || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and price'
      });
    }
    
    // Create new membership plan
    const plan = new MembershipPlan({
      title,
      description,
      price,
      benefits: benefits || [],
      creator: req.user.id
    });
    
    await plan.save();
    
    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully',
      data: plan
    });
  } catch (error) {
    console.error('Error creating membership plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating membership plan',
      error: error.message
    });
  }
});

// Update a membership plan
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, benefits } = req.body;
    
    // Validate request
    if (!title && !description && price === undefined && !benefits) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }
    
    // Find membership plan
    const plan = await MembershipPlan.findById(id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }
    
    // Check if user is the creator of the membership plan
    if (plan.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this membership plan'
      });
    }
    
    // Update membership plan
    if (title) plan.title = title;
    if (description) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (benefits) plan.benefits = benefits;
    plan.updatedAt = Date.now();
    
    await plan.save();
    
    res.json({
      success: true,
      message: 'Membership plan updated successfully',
      data: plan
    });
  } catch (error) {
    console.error('Error updating membership plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating membership plan',
      error: error.message
    });
  }
});

// Delete a membership plan
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find membership plan
    const plan = await MembershipPlan.findById(id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }
    
    // Check if user is the creator of the membership plan
    if (plan.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this membership plan'
      });
    }
    
    // Delete membership plan
    await MembershipPlan.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Membership plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting membership plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting membership plan',
      error: error.message
    });
  }
});

module.exports = router;
