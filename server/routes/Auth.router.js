const express = require('express');
const router = express.Router();

const { login, refresh, logout, me } = require("../controllers/Auth.controller");

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/logout', logout);
router.get('/me', me);

module.exports = router;
