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
  uploadPicture
} = require('../controllers/User.controller');

const { verifyJWT } = require('../middleware/authentication');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/allUsers', getAllUsers);
router.get('/profile', getProfile);
router.get('/getTotalCredits', getTotalCredits);
router.get('/logout', logoutUser);
router.put('/updateCredits', updateTotalCredits);
router.post('/uploadPicture', verifyJWT, upload.single('profilePic'), uploadPicture);

module.exports = router;
