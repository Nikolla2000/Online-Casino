const express = require('express');
const router = express.Router();
const upload = require('../../helpers/fileUpload');

const {
  registerUser,
  getProfile,
  updateTotalCredits,
  uploadPicture,
  updatePreferences,
  getUserStats,
  getRecentActivity,
  getGameHistory,
  getTotalCreditsOld
} = require('../../controllers/User.controller');

const { verifyJWT } = require('../../middleware/authentication');

/**
 * @swagger
 * tags:
 *   name: Users (v1)
 *   description: Legacy user endpoints (v1)
 */

/**
 * @swagger
 * /v1/user/register:
 *   post:
 *     summary: Register a new user (legacy)
 *     tags: [Users (v1)]
 *     deprecated: true
 *     description: This endpoint is deprecated. Use POST /v2/users/register instead.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Mitko"
 *               lastName:
 *                 type: string
 *                 example: "Mitkov"
 *               username:
 *                 type: string
 *                 example: "mitko_mitkov123"
 *               email:
 *                 type: string
 *                 example: "mitko@example.com"
 *               password:
 *                 type: string
 *                 example: "somepass123"
 *               confirm_password:
 *                 type: string
 *                 example: "somepass123"
 *               country:
 *                 type: string
 *                 example: "BG"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields or passwords do not match
 *       409:
 *         description: Username or email already exists
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /v1/user/profile:
 *   get:
 *     summary: Get user profile from cookie token (legacy)
 *     tags: [Users (v1)]
 *     deprecated: true
 *     description: This endpoint is deprecated. Use GET /v1/auth/me instead.
 *     security: []
 *     responses:
 *       200:
 *         description: Returns user data from JWT cookie token
 *       400:
 *         description: Returns "No token" if cookie is missing
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /v1/user/credits:
 *   get:
 *     summary: Get total credits for the authenticated user (legacy)
 *     tags: [Users (v1)]
 *     deprecated: true
 *     description: This endpoint is deprecated. Use GET /v2/users/:userId/credits instead.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns total credits
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
router.get('/credits', verifyJWT, getTotalCreditsOld);

/**
 * @swagger
 * /v1/user/{userId}/credits:
 *   put:
 *     summary: Update total credits for a user (Admin only)
 *     tags: [Users (v1)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalCredits
 *             properties:
 *               totalCredits:
 *                 type: number
 *                 description: New credits amount (0 - 100,000)
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Credits updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Total credits updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     totalCredits:
 *                       type: number
 *       400:
 *         description: Invalid credits value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin role required
 *       404:
 *         description: User not found
 */
router.put('/:userId/credits', verifyJWT, updateTotalCredits);

/**
 * @swagger
 * /v1/user/uploadPicture:
 *   post:
 *     summary: Upload a profile picture
 *     tags: [Users (v1)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePic
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile picture uploaded successfully"
 *                 profilePic:
 *                   type: string
 *                   example: "/uploads/pfps/64abc-1234567890.jpg"
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: File system or database error
 */
router.post('/uploadPicture', verifyJWT, upload.single('profilePic'), uploadPicture);

/**
 * @swagger
 * /v1/user/notification-preferences:
 *   patch:
 *     summary: Update notification and marketing preferences
 *     tags: [Users (v1)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bonusOffers:
 *                 type: boolean
 *                 example: true
 *               gameUpdates:
 *                 type: boolean
 *                 example: false
 *               vipEvents:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Notifications updated successfully"
 *       400:
 *         description: Invalid data format (must be boolean)
 *       401:
 *         description: Unauthorized
 */
router.patch('/notification-preferences', verifyJWT, updatePreferences);

/**
 * @swagger
 * /v1/user/stats:
 *   get:
 *     summary: Get game statistics for the authenticated user
 *     tags: [Users (v1)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats returned successfully (cached for 5 minutes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalWagered:
 *                       type: number
 *                       example: 5000
 *                     totalWins:
 *                       type: number
 *                       example: 3200
 *                     totalRoundsPlayed:
 *                       type: number
 *                       example: 47
 *                 favoriteGame:
 *                   type: string
 *                   enum: [slots, roulette, "None yet"]
 *                   example: "slots"
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', verifyJWT, getUserStats);

/**
 * @swagger
 * /v1/user/recent-activity:
 *   get:
 *     summary: Get recent game activity from the last month
 *     tags: [Users (v1)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity returned successfully (cached for 3 minutes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 recentActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       gameType:
 *                         type: string
 *                         enum: [slots, roulette]
 *                       betAmount:
 *                         type: number
 *                       winAmount:
 *                         type: number
 *                       netProfit:
 *                         type: number
 *                       timestamp:
 *                         type: string
 *                         example: "2024-01-01T12:00:00.000Z"
 *       401:
 *         description: Unauthorized
 */
router.get('/recent-activity', verifyJWT, getRecentActivity);

/**
 * @swagger
 * /v1/user/game-history:
 *   get:
 *     summary: Get paginated game history for the authenticated user
 *     tags: [Users (v1)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *     responses:
 *       200:
 *         description: Game history returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalRecords:
 *                       type: integer
 *                     recordsPerPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *       400:
 *         description: Page out of range
 *       401:
 *         description: Unauthorized
 */
router.get('/game-history', verifyJWT, getGameHistory);

module.exports = router;