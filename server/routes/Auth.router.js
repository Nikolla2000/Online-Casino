const express = require('express');
const router = express.Router();

const { login, refresh, logout } = require("../controllers/Auth.controller");

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/logout', logout);

module.exports = router;
