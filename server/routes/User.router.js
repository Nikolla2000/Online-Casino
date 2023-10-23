const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/User.controller');
const { verifyJWT } = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.get('/allUsers', getAllUsers)
// router.get('/userProfile', verifyJWT, (req, res) => {
//   res.json({ message: 'User profile data' });
// });

module.exports = router;