const express = require('express');
const router = express.Router()
const { sendEmail } = require('../controllers/Email.controller');
const { validateEmail } = require('../middleware/emailValidation');

router.post('/sendEmail', validateEmail, sendEmail);

module.exports = router;