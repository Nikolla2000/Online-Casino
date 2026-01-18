const express = require('express');
const { verifyJWT } = require('../../middleware/authentication');
const { getUsers, getTotalCredits, registerUserV2 } = require('../../controllers/User.controller');
const { validateRequest } = require('../../middleware/validateRequest');
const { default: z } = require('zod');
const { registerSchema } = require('../../validation-schemas/user.schema');
const router = express.Router();

router.get('/', verifyJWT, getUsers);
router.get('/:userId/credits', verifyJWT, getTotalCredits);
router.post('/register', validateRequest(z.object({ body: registerSchema })), registerUserV2);

module.exports = router;