const express = require('express');
const router = express.Router();

const { login, refresh, logout, me, oauthLogin } = require("../../controllers/Auth.controller");
const { verifyJWT } = require('../../middleware/authentication');

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/logout', logout);
router.get('/me', verifyJWT, me);
router.post('/oauth', oauthLogin);

module.exports = router;
