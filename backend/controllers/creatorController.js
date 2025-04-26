const Creator = require('../models/Creator');
const AppError = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');

// Utility function to check if wallet address is valid (basic check)
const isValidWalletAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Get all creators (public)
exports.getAllCreators = catchAsync(async (req, res) => {
  const creators = await Creator.find()
    .select('username name bio profilePic stats')
    .sort('-stats.totalFundsReceived');

  res.json({
    status: 'success',
    results: creators.length,
    data: creators
  });
});

// Get creator profile by username (public)
exports.getCreatorProfile = catchAsync(async (req, res, next) => {
  const creator = await Creator.findOne({ 
    username: req.params.username.toLowerCase() 
  }).select('-nonce');
  
  if (!creator) {
    return next(new AppError('Creator not found', 404));
  }

  res.json({
    status: 'success',
    data: creator
  });
});

// Get creator by wallet address (public)
exports.getCreatorByWallet = catchAsync(async (req, res, next) => {
  const { walletAddress } = req.params;

  if (!isValidWalletAddress(walletAddress)) {
    return next(new AppError('Invalid wallet address format', 400));
  }

  const creator = await Creator.findOne({ 
    walletAddress 
  }).select('-nonce');
  
  if (!creator) {
    return next(new AppError('Creator not found', 404));
  }

  res.json({
    status: 'success',
    data: creator
  });
});

// Register creator (public)
exports.registerCreator = catchAsync(async (req, res, next) => {
  const { username, walletAddress, name, bio, profilePic } = req.body;

  // Validation
  if (!username || !walletAddress) {
    return next(new AppError('Username and wallet address are required', 400));
  }

  if (!isValidWalletAddress(walletAddress)) {
    return next(new AppError('Invalid wallet address format', 400));
  }

  // Check existing username
  const existingUsername = await Creator.findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    return next(new AppError('Username already taken', 400));
  }

  // Check existing wallet
  const existingWallet = await Creator.findOne({ walletAddress });
  if (existingWallet) {
    return next(new AppError('Wallet address already registered', 400));
  }

  // Create creator
  const creator = await Creator.create({
    username: username.toLowerCase(),
    walletAddress,
    name,
    bio,
    profilePic
  });

  res.status(201).json({
    status: 'success',
    data: creator
  });
});

// Update creator profile (protected)
exports.updateCreatorProfile = catchAsync(async (req, res, next) => {
  const { name, bio, profilePic, socialLinks } = req.body;
  const creator = req.creator; // From auth middleware

  // Only allow updating these fields
  const updateData = {
    ...(name && { name }),
    ...(bio && { bio }),
    ...(profilePic && { profilePic }),
    ...(socialLinks && { socialLinks })
  };

  if (Object.keys(updateData).length === 0) {
    return next(new AppError('No valid update fields provided', 400));
  }

  // Update creator
  Object.assign(creator, updateData);
  await creator.save();

  res.json({
    status: 'success',
    data: creator
  });
});

// Get creator stats (protected)
exports.getCreatorStats = catchAsync(async (req, res) => {
  const creator = req.creator; // From auth middleware

  const stats = {
    totalFundsReceived: creator.stats.totalFundsReceived,
    totalTransactions: creator.stats.totalTransactions,
    uniqueSupporters: creator.stats.uniqueSupporters,
    // Add any additional stats you want to track
  };

  res.json({
    status: 'success',
    data: stats
  });
});

// Check username availability (public)
exports.checkUsernameAvailability = catchAsync(async (req, res, next) => {
  if (!req.params.username) {
    return next(new AppError('Username parameter is required', 400));
  }

  const creator = await Creator.findOne({ 
    username: req.params.username.toLowerCase() 
  });
  
  res.json({
    status: 'success',
    data: { 
      username: req.params.username,
      available: !creator 
    }
  });
});
