const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCreatorProfile,
  updateCreatorProfile,
  getAllCreators,
  getCreatorByWallet,
  getCreatorStats
} = require('../controllers/creatorController');

// Public routes
router.get('/', getAllCreators);
router.get('/profile/:username', getCreatorProfile);
router.get('/wallet/:walletAddress', getCreatorByWallet);

// Protected routes (require authentication)
router.use(protect);
router.put('/profile/update', updateCreatorProfile);
router.get('/stats', getCreatorStats);

// Welcome route
router.get('/welcome', (req, res) => {
  res.send('Welcome to the Creator Funding Platform API 🚀');
});

module.exports = router;
