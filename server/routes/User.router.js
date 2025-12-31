const express = require('express');
const router = express.Router();
const upload = require('../helpers/fileUpload');

const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getProfile,
  updateTotalCredits,
  getTotalCredits,
  uploadPicture,
  getOnlineUsers,
  updatePreferences,
  getUserStats,
  getRecentActivity,
  getGameHistory
} = require('../controllers/User.controller');

const { verifyJWT } = require('../middleware/authentication');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/allUsers', getAllUsers);
router.get('/profile', getProfile);
router.get('/totalCredits', verifyJWT, getTotalCredits);
router.put('/updateCredits', updateTotalCredits);
router.post('/uploadPicture', verifyJWT, upload.single('profilePic'), uploadPicture);
router.get('/online', getOnlineUsers);
router.patch('/notification-preferences', verifyJWT, updatePreferences);
router.get('/stats', verifyJWT, getUserStats);
router.get('/recent-activity', verifyJWT, getRecentActivity);
router.get('/game-history', verifyJWT, getGameHistory);

module.exports = router;
