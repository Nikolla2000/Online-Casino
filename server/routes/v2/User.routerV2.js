const express = require('express');
const { verifyJWT } = require('../../middleware/authentication');
const { getUsers, getTotalCredits } = require('../../controllers/User.controller');
const router = express.Router();

router.get('/', verifyJWT, getUsers);
router.get('/:userId/credits', verifyJWT, getTotalCredits);

module.exports = router;