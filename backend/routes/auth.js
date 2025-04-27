const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { uploadProfileImage } = require('../utils/fileUpload');
const path = require('path');
const fs = require('fs');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-should-be-in-env-file';

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress, bio, profileImage } = req.body;
    
    // Validate request
    if (!username || !email || !password || !walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username, email, password, and wallet address' 
      });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }, { walletAddress }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email, username, or wallet address already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      walletAddress,
      bio: bio || '',
      profileImage: profileImage || ''
    });
    
    await user.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      data: { 
        username, 
        email, 
        walletAddress 
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate request
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username and password' 
      });
    }
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      data: { 
        userId: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        totalDonations: user.totalDonations,
        token: token
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error logging in',
      error: error.message 
    });
  }
});

// Get current user - Protected route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // User is already available in req.user from the authMiddleware
    const user = req.user;
    
    // Return user data without password
    res.json({ 
      success: true, 
      message: 'User retrieved successfully',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        totalDonations: user.totalDonations,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving user',
      error: error.message 
    });
  }
});

// Update user profile
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, bio, socialLinks } = req.body;
    const user = req.user;
    
    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    
    // Update social links if provided
    if (socialLinks) {
      if (socialLinks.twitter !== undefined) user.socialLinks.twitter = socialLinks.twitter;
      if (socialLinks.instagram !== undefined) user.socialLinks.instagram = socialLinks.instagram;
      if (socialLinks.youtube !== undefined) user.socialLinks.youtube = socialLinks.youtube;
      if (socialLinks.github !== undefined) user.socialLinks.github = socialLinks.github;
      if (socialLinks.linkedin !== undefined) user.socialLinks.linkedin = socialLinks.linkedin;
      if (socialLinks.website !== undefined) user.socialLinks.website = socialLinks.website;
    }
    
    // Save updated user
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        totalDonations: user.totalDonations,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Upload profile image
router.post('/upload-profile-image', authMiddleware, (req, res) => {
  uploadProfileImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Error uploading image',
        error: err.message
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    try {
      const user = req.user;
      
      // Delete old profile image if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, '..', user.profileImage.replace(/^\/uploads/, 'uploads'));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Update user with new profile image path
      const imagePath = `/uploads/profiles/${req.file.filename}`;
      user.profileImage = imagePath;
      await user.save();
      
      res.json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: {
          profileImage: imagePath
        }
      });
    } catch (error) {
      console.error('Error saving profile image:', error);
      res.status(500).json({
        success: false,
        message: 'Error saving profile image',
        error: error.message
      });
    }
  });
});

// Get user donations
router.get('/donations', authMiddleware, async (req, res) => {
  try {
    // In a real app, you would fetch donations from a database
    // For now, we'll return a placeholder amount
    const totalDonations = Math.floor(Math.random() * 10) + 0.5; // Random amount between 0.5 and 10 ETH
    
    res.json({
      success: true,
      message: 'Donations retrieved successfully',
      data: {
        totalDonations,
        currency: 'ETH'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving donations',
      error: error.message
    });
  }
});

// Get all creators - Public route
router.get('/creators', async (req, res) => {
  try {
    // Find all users (excluding password field)
    const creators = await User.find().select('-password');
    
    // Add random donation amounts for demo purposes
    const creatorsWithDonations = creators.map(creator => {
      const totalDonations = (Math.floor(Math.random() * 1000) / 100).toFixed(2); // Random amount between 0 and 10 ETH
      return {
        _id: creator._id,
        username: creator.username,
        walletAddress: creator.walletAddress,
        bio: creator.bio || 'Creative content creator passionate about Web3 technology.',
        profileImage: creator.profileImage || '',
        createdAt: creator.createdAt,
        totalDonations
      };
    });
    
    res.json({
      success: true,
      message: 'Creators retrieved successfully',
      data: creatorsWithDonations
    });
  } catch (error) {
    console.error('Error fetching creators:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving creators',
      error: error.message
    });
  }
});

// Get a single creator by ID - Public route
router.get('/creator/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find creator by ID (excluding password field)
    const creator = await User.findById(id).select('-password');
    
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }
    
    // Add random donation amount for demo purposes
    // In a real app, this would come from a donations collection
    const totalDonations = (Math.floor(Math.random() * 1000) / 100).toFixed(2); // Random amount between 0 and 10 ETH
    
    const creatorData = {
      _id: creator._id,
      username: creator.username,
      walletAddress: creator.walletAddress,
      bio: creator.bio || 'Creative content creator passionate about Web3 technology.',
      profileImage: creator.profileImage || '',
      createdAt: creator.createdAt,
      totalDonations
    };
    
    res.json({
      success: true,
      message: 'Creator retrieved successfully',
      data: creatorData
    });
  } catch (error) {
    console.error('Error fetching creator:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving creator',
      error: error.message
    });
  }
});

// Record a donation - Public route
router.post('/donation', async (req, res) => {
  try {
    const { creatorId, donorAddress, amount, transactionHash } = req.body;
    
    // Validate request
    if (!creatorId || !donorAddress || !amount || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: creatorId, donorAddress, amount, transactionHash'
      });
    }
    
    // Check if creator exists
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }
    
    // In a real app, you would save the donation to a database
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Donation recorded successfully',
      data: {
        creatorId,
        donorAddress,
        amount,
        transactionHash,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording donation',
      error: error.message
    });
  }
});

// Update user password
router.put('/update-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    
    // Validate request
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
});

// Get all creators
router.get('/creators', async (req, res) => {
  try {
    const creators = await User.find().select('-password');
    
    res.json({
      success: true,
      message: 'Creators retrieved successfully',
      data: creators
    });
  } catch (error) {
    console.error('Error retrieving creators:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving creators',
      error: error.message
    });
  }
});

module.exports = router;
