const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getProfile,
  updateTotalCredits
} = require('../controllers/User.controller');

const { verifyJWT } = require('../middleware/authentication');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/allUsers', getAllUsers);
router.get('/profile', getProfile);
router.get('/logout', logoutUser);
router.put('/updateCredits', updateTotalCredits)

module.exports = router;
