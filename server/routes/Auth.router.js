const express = require('express');
const router = express.Router();

const { login, validateToken} = require("../controllers/Auth.controller");

router.post('/login', login);
router.post('/validate', validateToken);

module.exports = router;
