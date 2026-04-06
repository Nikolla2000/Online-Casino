const express = require('express');
const { verifyJWT } = require('../../middleware/authentication');
const { playSlotsRound, playRouletteRound } = require('../../controllers/Game.controller');

const router = express.Router();

router.use(verifyJWT);

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Casino game endpoints
 */

/**
 * @swagger
 * /v1/game/slots:
 *   post:
 *     summary: Play a round of slots
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - betAmount
 *             properties:
 *               betAmount:
 *                 type: number
 *                 description: Must be between 100 and 1000
 *                 example: 100
 *     responses:
 *       200:
 *         description: Slots round result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 betAmount:
 *                   type: number
 *                   example: 100
 *                 winAmount:
 *                   type: number
 *                   example: 300
 *                 netProfit:
 *                   type: number
 *                   example: 200
 *                 multiplier:
 *                   type: number
 *                   example: 3
 *                 reels:
 *                   type: array
 *                   description: 3x5 grid of symbols (numbers 1-12)
 *                   example: [[1,5,12,3,7],[4,8,2,11,6],[9,3,7,1,10]]
 *                   items:
 *                     type: array
 *                     items:
 *                       type: number
 *                 winningLines:
 *                   type: array
 *                   description: All winning paylines in this spin
 *                   items:
 *                     type: object
 *                     properties:
 *                       lineNumber:
 *                         type: number
 *                         example: 2
 *                       pattern:
 *                         type: string
 *                         example: "Middle Row"
 *                       multiplier:
 *                         type: number
 *                         example: 3
 *                       symbols:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [7,7,7,7,7]
 *                 isWin:
 *                   type: boolean
 *                 balanceBefore:
 *                   type: number
 *                   example: 500
 *                 balanceAfter:
 *                   type: number
 *                   example: 700
 *                 gameId:
 *                   type: string
 *                   nullable: true
 *                   description: null in development, saved only in production
 *                   example: "64abc123def456"
 *       400:
 *         description: Invalid bet amount (not between 100-1000) or insufficient credits
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Slots service failure
 */
router.post('/slots', playSlotsRound);

/**
 * @swagger
 * /v1/game/roulette:
 *   post:
 *     summary: Play a round of roulette
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - betAmount
 *               - betType
 *             properties:
 *               betAmount:
 *                 type: number
 *                 example: 25
 *               betType:
 *                 type: string
 *                 enum: [number, red, black, even, odd, low, high, first_dozen, second_dozen, third_dozen, first_column, second_column, third_column]
 *                 example: "red"
 *               betValue:
 *                 type: number
 *                 description: Required only when betType is "number" (0-36)
 *                 example: 17
 *     responses:
 *       200:
 *         description: Roulette round result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 spinResult:
 *                   type: object
 *                   properties:
 *                     randNumber:
 *                       type: number
 *                       example: 17
 *                     color:
 *                       type: string
 *                       enum: [red, black, green]
 *                       example: "red"
 *                 betType:
 *                   type: string
 *                   example: "red"
 *                 betValue:
 *                   type: number
 *                   example: 17
 *                 isWin:
 *                   type: boolean
 *                 multiplier:
 *                   type: number
 *                   example: 1
 *                 winAmount:
 *                   type: number
 *                   example: 50
 *                 netProfit:
 *                   type: number
 *                   example: 25
 *                 balanceBefore:
 *                   type: number
 *                   example: 500
 *                 balanceAfter:
 *                   type: number
 *                   example: 525
 *                 gameId:
 *                   type: string
 *                   example: "64abc123def456"
 *       400:
 *         description: Invalid bet parameters or insufficient credits
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Roulette service failure
 */
router.post('/roulette', playRouletteRound);

module.exports = router;