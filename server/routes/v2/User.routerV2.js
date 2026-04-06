const express = require('express');
const { verifyJWT } = require('../../middleware/authentication');
const { getUsers, getTotalCredits, registerUserV2, getUserProfile, blockUser, unblockUser, getBlockedUsers } = require('../../controllers/User.controller');
const { validateRequest } = require('../../middleware/validateRequest');
const { default: z } = require('zod');
const { registerSchema } = require('../../validation-schemas/user.schema');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /v2/users:
 *   get:
 *     summary: Get users with optional filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: online
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by online status
 *       - in: query
 *         name: vip
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by VIP status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           maximum: 100
 *         description: Maximum number of users to return (max 100)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [username, totalCredits, lastSeen, registrationDate]
 *         description: Field to sort by (default username)
 *     responses:
 *       200:
 *         description: List of users returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                   example: 12
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid sort field or limit value
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyJWT, getUsers);

/**
 * @swagger
 * /v2/users/{userId}/credits:
 *   get:
 *     summary: Get total credits for a specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User credits returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCredits:
 *                   type: number
 *                   example: 1500
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:userId/credits', verifyJWT, getTotalCredits);

/**
 * @swagger
 * /v2/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Username or email already exists
 */
router.post('/register', validateRequest(z.object({ body: registerSchema })), registerUserV2);

/**
 * @swagger
 * /v2/users/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                 isBlocked:
 *                   type: boolean
 *                   description: Whether the current user has blocked this profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:userId', verifyJWT, getUserProfile);

/**
 * @swagger
 * /v2/users/{userId}/block:
 *   post:
 *     summary: Block a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to block
 *     responses:
 *       201:
 *         description: User blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is blocked"
 *       400:
 *         description: Cannot block yourself
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Unblock a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unblock
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is unblocked"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Block record not found
 */
router.post('/:userId/block', verifyJWT, blockUser);
router.delete('/:userId/block', verifyJWT, unblockUser);

/**
 * @swagger
 * /v2/users/{userId}/blocked:
 *   get:
 *     summary: Get all users blocked by the current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the current user
 *     responses:
 *       200:
 *         description: Blocked users list returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   blockedId:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       profileImage:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/:userId/blocked', verifyJWT, getBlockedUsers);

module.exports = router;