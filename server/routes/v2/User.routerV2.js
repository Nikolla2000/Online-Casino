const express = require('express');
const { verifyJWT } = require('../../middleware/authentication');
const { getUsers, getTotalCredits, registerUserV2, getUserProfile, blockUser, unblockUser, getBlockedUsers } = require('../../controllers/User.controller');
const { validateRequest } = require('../../middleware/validateRequest');
const { default: z } = require('zod');
const { registerSchema } = require('../../validation-schemas/user.schema');
const router = express.Router();

router.get('/', verifyJWT, getUsers);
router.get('/:userId/credits', verifyJWT, getTotalCredits);
router.post('/register', validateRequest(z.object({ body: registerSchema })), registerUserV2);
router.get('/:userId', verifyJWT, getUserProfile);
router.post('/:userId/block', verifyJWT, blockUser);
router.delete('/:userId/block', verifyJWT, unblockUser);
router.get('/:userId/blocked', verifyJWT, getBlockedUsers);

module.exports = router;