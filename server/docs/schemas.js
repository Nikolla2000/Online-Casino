/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64abc123def456"
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 20
 *           example: "Mitko"
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 20
 *           example: "Mitkov"
 *         username:
 *           type: string
 *           minLength: 4
 *           maxLength: 20
 *           example: "mitko_mitkov123"
 *         email:
 *           type: string
 *           unique: true
 *           example: "mitko@example.com"
 *         oauthProvider:
 *           type: string
 *           nullable: true
 *           enum: [google, github, facebook, null]
 *           default: null
 *           example: "google"
 *         oauthId:
 *           type: string
 *           nullable: true
 *           default: null
 *           example: null
 *         hasPassword:
 *           type: boolean
 *           default: true
 *           description: False for OAuth users who registered without a password
 *         registrationDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         country:
 *           type: string
 *           default: "Unknown"
 *           example: "BG"
 *         totalCredits:
 *           type: number
 *           default: 10000
 *           example: 1500
 *         profileImage:
 *           type: string
 *           default: "/images/user.png"
 *           example: "/uploads/pfps/64abc-1234567890.jpg"
 *         isOnline:
 *           type: boolean
 *           default: false
 *         lastSeen:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T10:30:00.000Z"
 *         isVip:
 *           type: boolean
 *           default: false
 *         isVerified:
 *           type: boolean
 *           default: false
 *         totalWagered:
 *           type: number
 *           default: 0
 *           example: 5000
 *         totalWon:
 *           type: number
 *           default: 0
 *           example: 3200
 *         gamesPlayed:
 *           type: number
 *           default: 0
 *           example: 47
 *         bonusOffers:
 *           type: boolean
 *           default: false
 *         gameUpdates:
 *           type: boolean
 *           default: false
 *         vipEvents:
 *           type: boolean
 *           default: false
 *       required:
 *         - firstName
 *         - lastName
 *         - username
 *         - email
 * 
 * 
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64abc123def456"
 *         userId:
 *           type: string
 *           description: Reference to User
 *           example: "64abc123def456"
 *         type:
 *           type: string
 *           enum: [slots_bet, slots_win, roulette_bet, roulette_win, deposit, withdrawal]
 *           example: "slots_win"
 *         amount:
 *           type: number
 *           description: Positive for wins/deposits, negative for bets/withdrawals
 *           example: 300
 *         balanceBefore:
 *           type: number
 *           example: 1000
 *         balanceAfter:
 *           type: number
 *           example: 1300
 *         gameType:
 *           type: string
 *           enum: [slots, roulette]
 *           nullable: true
 *           description: Present only for game-related transactions
 *           example: "slots"
 *         gameId:
 *           type: string
 *           nullable: true
 *           description: Reference to GameHistory - present only for game-related transactions
 *           example: "64abc123def456"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Auto-expires after 30 days (TTL index)
 *           example: "2024-01-01T12:00:00.000Z"
 *       required:
 *         - userId
 *         - type
 *         - amount
 *         - balanceBefore
 *         - balanceAfter
 *
 * 
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64abc123def456"
 *         chatId:
 *           type: string
 *           description: Reference to Chat
 *           example: "64abc123def456"
 *         senderId:
 *           type: string
 *           description: Reference to User
 *           example: "64abc123def456"
 *         receiverId:
 *           type: string
 *           description: Reference to User
 *           example: "64abc123def456"
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           example: "Hey, how are you?"
 *         read:
 *           type: boolean
 *           default: false
 *           example: false
 *         readAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Populated when the message is read
 *           example: "2024-01-01T12:05:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:05:00.000Z"
 *       required:
 *         - chatId
 *         - senderId
 *         - receiverId
 *         - content
 * 
 * 
 *     GameHistory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64abc123def456"
 *         userId:
 *           type: string
 *           description: Reference to User
 *           example: "64abc123def456"
 *         gameType:
 *           type: string
 *           enum: [slots, roulette]
 *           example: "slots"
 *         betAmount:
 *           type: number
 *           minimum: 0
 *           example: 100
 *         winAmount:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 300
 *         netProfit:
 *           type: number
 *           description: winAmount - betAmount (negative on loss)
 *           example: 200
 *         result:
 *           type: object
 *           description: Game-specific result data (varies by gameType)
 *           oneOf:
 *             - title: SlotsResult
 *               properties:
 *                 reels:
 *                   type: array
 *                   description: 3x5 grid of symbols
 *                   example: [[1,5,12,3,7],[4,8,2,11,6],[9,3,7,1,10]]
 *                   items:
 *                     type: array
 *                     items:
 *                       type: number
 *                 winningLines:
 *                   type: array
 *                   items:
 *                     type: object
 *                 multiplier:
 *                   type: number
 *             - title: RouletteResult
 *               properties:
 *                 spinResult:
 *                   type: object
 *                   properties:
 *                     randNumber:
 *                       type: number
 *                       example: 17
 *                     color:
 *                       type: string
 *                       enum: [red, black, green]
 *                 betType:
 *                   type: string
 *                   example: "red"
 *                 betValue:
 *                   type: number
 *                   nullable: true
 *                   example: null
 *                 multiplier:
 *                   type: number
 *                   example: 1
 *         balanceBefore:
 *           type: number
 *           example: 1000
 *         balanceAfter:
 *           type: number
 *           example: 1200
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Auto-expires after 90 days (TTL index)
 *           example: "2024-01-01T12:00:00.000Z"
 *       required:
 *         - userId
 *         - gameType
 *         - betAmount
 *         - winAmount
 *         - netProfit
 *         - result
 *         - balanceBefore
 *         - balanceAfter
 *
 * 
 *     ChatbotMessage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64abc123def456"
 *         userId:
 *           type: string
 *           description: Reference to User
 *           example: "64abc123def456"
 *         userMessage:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           example: "What games do you offer?"
 *         aiResponse:
 *           type: string
 *           example: "We offer slots and roulette!"
 *         timeStamp:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00.000Z"
 *         tokenUsed:
 *           type: number
 *           default: 0
 *           description: Number of tokens consumed for this message
 *           example: 124
 *       required:
 *         - userId
 *         - userMessage
 *         - aiResponse
 * 
 * 
 *     Chat:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64abc123def456"
 *         participants:
 *           type: array
 *           description: Exactly 2 user IDs in the conversation
 *           items:
 *             type: string
 *           example: ["64abc123def456", "64abc123def789"]
 *         lastMessage:
 *           type: string
 *           nullable: true
 *           description: Reference to the most recent Message
 *           example: "64abc123def456"
 *         lastActivity:
 *           type: string
 *           format: date-time
 *           description: Updated on every new message for sorting conversations
 *           example: "2024-01-01T12:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00.000Z"
 *       required:
 *         - participants
 *
 * 
 *     Blocking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64abc123def456"
 *         blockerId:
 *           type: string
 *           description: Reference to User who initiated the block
 *           example: "64abc123def456"
 *         blockedId:
 *           type: string
 *           description: Reference to User who was blocked
 *           example: "64abc123def789"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00.000Z"
 *       required:
 *         - blockerId
 *         - blockedId
 */
