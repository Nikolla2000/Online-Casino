const express = require('express');
const router = express.Router();
const upload = require('../../helpers/fileUpload');

const {
  registerUser,
  getProfile,
  updateTotalCredits,
  uploadPicture,
  updatePreferences,
  getUserStats,
  getRecentActivity,
  getGameHistory,
  getTotalCreditsOld
} = require('../../controllers/User.controller');

const { verifyJWT } = require('../../middleware/authentication');

router.post('/register', registerUser);
router.get('/profile', getProfile);
router.get('/credits', verifyJWT, getTotalCreditsOld);
router.put('/:userId/credits', verifyJWT, updateTotalCredits);
router.post('/uploadPicture', verifyJWT, upload.single('profilePic'), uploadPicture);
router.patch('/notification-preferences', verifyJWT, updatePreferences);
router.get('/stats', verifyJWT, getUserStats);
router.get('/recent-activity', verifyJWT, getRecentActivity);
router.get('/game-history', verifyJWT, getGameHistory);

module.exports = router;
