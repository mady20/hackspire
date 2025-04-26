const Creator = require('../models/Creator');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorHandler');

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Get nonce for new connection
exports.getNonce = catchAsync(async (req, res, next) => {
  const { walletAddress } = req.params;

  if (!ethers.isAddress(walletAddress)) {
    return next(new AppError('Invalid wallet address', 400));
  }

  // Check if creator exists
  let creator = await Creator.findOne({ walletAddress });
  const nonce = Math.floor(Math.random() * 1000000).toString();
  
  if (!creator) {
    // New user
    creator = await Creator.create({
      walletAddress,
      nonce,
      username: `temp_${nonce}`,
      isProfileComplete: false
    });

    return res.json({
      status: 'success',
      data: {
        message: `Please sign this message to verify your wallet ownership: ${nonce}`,
        isNewUser: true
      }
    });
  }

  // Existing user
  creator.nonce = nonce;
  await creator.save();

  res.json({
    status: 'success',
    data: {
      message: `Please sign this message to verify your wallet ownership: ${nonce}`,
      isNewUser: false,
      isProfileComplete: creator.isProfileComplete
    }
  });
});

// Login existing user
exports.login = catchAsync(async (req, res, next) => {
  const { walletAddress } = req.params;

  if (!ethers.isAddress(walletAddress)) {
    return next(new AppError('Invalid wallet address', 400));
  }

  const creator = await Creator.findOne({ walletAddress });
  if (!creator) {
    return next(new AppError('No creator found with this wallet address', 404));
  }

  const nonce = Math.floor(Math.random() * 1000000).toString();
  creator.nonce = nonce;
  await creator.save();

  res.json({
    status: 'success',
    data: {
      message: `Please sign this message to verify your wallet ownership: ${nonce}`,
      isProfileComplete: creator.isProfileComplete
    }
  });
});

// Verify signature
exports.verifySignature = catchAsync(async (req, res, next) => {
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    return next(new AppError('Please provide wallet address and signature', 400));
  }

  const creator = await Creator.findOne({ walletAddress });
  if (!creator) {
    return next(new AppError('Creator not found', 404));
  }

  // Verify signature
  const message = `Please sign this message to verify your wallet ownership: ${creator.nonce}`;
  const recoveredAddress = ethers.verifyMessage(message, signature);

  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    return next(new AppError('Invalid signature', 401));
  }

  // Generate new nonce for next login
  creator.nonce = Math.floor(Math.random() * 1000000).toString();
  creator.lastLogin = Date.now();
  await creator.save();

  // Generate token
  const token = signToken(creator._id);

  res.json({
    status: 'success',
    data: {
      token,
      creator,
      isProfileComplete: creator.isProfileComplete
    }
  });
});

// Complete profile
exports.completeProfile = catchAsync(async (req, res, next) => {
  const { username, name, bio, profilePic, socialLinks } = req.body;
  const creator = req.creator; // From auth middleware

  if (!username || !name || !bio) {
    return next(new AppError('Please provide username, name and bio', 400));
  }

  // Check if username is taken (excluding current creator)
  const existingCreator = await Creator.findOne({
    username: username.toLowerCase(),
    _id: { $ne: creator._id }
  });

  if (existingCreator) {
    return next(new AppError('Username already taken', 400));
  }

  // Update profile
  creator.username = username;
  creator.name = name;
  creator.bio = bio;
  if (profilePic) creator.profilePic = profilePic;
  if (socialLinks) creator.socialLinks = socialLinks;

  await creator.save();

  res.json({
    status: 'success',
    data: creator
  });
});
