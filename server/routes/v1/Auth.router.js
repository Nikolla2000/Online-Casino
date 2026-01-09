const express = require('express');
const router = express.Router();

const { login, refresh, logout, me, oauthLogin } = require("../../controllers/Auth.controller");

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/logout', logout);
router.get('/me', me);
router.post('/oauth', oauthLogin);

module.exports = router;
