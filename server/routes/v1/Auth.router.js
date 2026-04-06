const express = require('express');
const router = express.Router();

const { login, refresh, logout, me, oauthLogin } = require("../../controllers/Auth.controller");
const { verifyJWT } = require('../../middleware/authentication');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Jikata
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful, returns access token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /v1/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: New access token issued
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /v1/auth/logout:
 *   get:
 *     summary: Logout and invalidate refresh token
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get('/logout', logout);

/**
 * @swagger
 * /v1/auth/me:
 *   get:
 *     summary: Get currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user data
 *       401:
 *         description: Unauthorized
 */
router.get('/me', verifyJWT, me);

/**
 * @swagger
 * /v1/auth/oauth:
 *   post:
 *     summary: Login or register via Google OAuth
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google OAuth token
 *     responses:
 *       200:
 *         description: OAuth login successful
 *       401:
 *         description: Invalid OAuth token
 */
router.post('/oauth', oauthLogin);

module.exports = router;