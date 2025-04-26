const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getNonce,
  verifySignature,
  completeProfile,
  login
} = require('../controllers/authController');

// Initial MetaMask connection for new users
router.get('/connect/:walletAddress', getNonce);

// Login for existing users
router.get('/login/:walletAddress', login);

// Verify MetaMask signature
router.post('/verify', verifySignature);

// Complete profile (protected route - requires valid JWT)
router.post('/complete-profile', protect, completeProfile);

module.exports = router;
