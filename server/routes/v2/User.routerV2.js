const express = require('express');
const { verifyJWT } = require('../../middleware/authentication');
const { getUsers } = require('../../controllers/User.controller');
const router = express.Router();

router.get('/', verifyJWT, getUsers);

module.exports = router;