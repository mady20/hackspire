const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const creatorSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Please provide a valid Ethereum address']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot be more than 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and dashes']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  profilePic: {
    type: String,
    default: 'default.jpg'
  },
  socialLinks: {
    twitter: String,
    instagram: String,
    website: String
  },
  stats: {
    totalFundsReceived: {
      type: Number,
      default: 0
    },
    totalTransactions: {
      type: Number,
      default: 0
    },
    uniqueSupporters: {
      type: Number,
      default: 0
    },
    lastPaymentReceived: Date
  },
  nonce: {
    type: String,
    required: true
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for public profile URL
creatorSchema.virtual('profileUrl').get(function() {
  return `/creator/${this.username}`;
});

// Index for faster queries
creatorSchema.index({ walletAddress: 1 });
creatorSchema.index({ username: 1 });
creatorSchema.index({ 'stats.totalFundsReceived': -1 });

// Pre-save middleware
creatorSchema.pre('save', async function(next) {
  // Update lastLogin on every save
  if (this.isModified('lastLogin')) {
    this.lastLogin = Date.now();
  }
  
  // Check if profile is complete
  this.isProfileComplete = Boolean(
    this.username && 
    this.username !== `temp_${this.nonce}` &&
    this.name &&
    this.bio
  );

  next();
});

// Instance methods
creatorSchema.methods.updateStats = async function(amount) {
  this.stats.totalFundsReceived += amount;
  this.stats.totalTransactions += 1;
  this.stats.lastPaymentReceived = Date.now();
  await this.save();
};

const Creator = mongoose.model('Creator', creatorSchema);

module.exports = Creator;
