const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const Creator = require('../models/Creator');
const AppError = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');

// Protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if creator still exists
  const creator = await Creator.findById(decoded.id);
  if (!creator) {
    return next(new AppError('The creator belonging to this token no longer exists.', 401));
  }

  // Grant access to protected route
  req.creator = creator;
  next();
});

// Optional: Restrict to complete profiles only
exports.restrictToComplete = catchAsync(async (req, res, next) => {
  if (!req.creator.isProfileComplete) {
    return next(new AppError('Please complete your profile first.', 403));
  }
  next();
});

// Verify MetaMask signature
exports.verifySignature = async (message, signature, walletAddress) => {
  try {
    const signerAddr = ethers.verifyMessage(message, signature);
    return signerAddr.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    return false;
  }
};

// Check if wallet address matches the authenticated creator
exports.checkWalletOwnership = (req, res, next) => {
  if (req.creator.walletAddress.toLowerCase() !== req.params.walletAddress.toLowerCase()) {
    return next(new AppError('You are not authorized to perform this action', 403));
  }
  next();
};
