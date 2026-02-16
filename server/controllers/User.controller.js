const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const { hashPassword, comparePasswords} = require('../helpers/auth');
const asyncHandler = require('../helpers/asyncHandler');
const GameHistory = require('../models/GameHistory.model');
const { default: mongoose } = require('mongoose');
const userService = require('../services/userService');
const { ValidationError, NotFoundError } = require('../helpers/errors');
const Blocking = require('../models/Blocking.model');


//Register Endpoint - OLD ENDPOINT - NOT USED!!! New registerUserV2 is now used.
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName, 
      username, 
      email,
      password,
      confirm_password,
      registrationDate, 
      country, 
      phoneNumber
    } = req.body;

    if (
      !firstName 
      || !lastName 
      || !username 
      || !email 
      || !password
      || !confirm_password) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }
  
      if(password !== confirm_password){
        res.status(400).json({ message: 'Passwords do not match'})
      }

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });

      if (existingUser) {
        return res.status(409).json({ message: 'User with this username or email already exists' });
      }

      // const hashedPassword = await hashPassword(password)

      const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password,
        registrationDate,
        country,
        // phoneNumber,
      });

      await newUser.save()

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


//Get User
const getProfile = (req, res) => {
  const {token} = req.cookies;
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (error, user) => {
      if(error) throw error;
      res.json(user)
    })
  }
  else {
    res.json('No token')
}
}


/**
 * Update total credits for a user
 * @route PUT /server/v1/user/credits
 * @access Private/Admin
 * @param {number} totalCredits - New total credits amount
 * @returns {Object} Updated user info
 */
const updateTotalCredits = asyncHandler(async (req, res) => {
  const { totalCredits} = req.body;
  const { userId } = req.params;
  const adminUserId = req.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required in URL parameters'
    });
  }

  const updatedUser = await userService.updateTotalCredits(userId, totalCredits, adminUserId);
  
  res.status(200).json({
    success: true,
    message: 'Total credits updated successfully',
    user: updatedUser
  });
});


const getTotalCreditsOld = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId }, 'totalCredits');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ totalCredits: user.totalCredits });
  } catch (err) {
    console.error('Error on getting total credits: ', err);
    res.status(500).json({ message: 'Failed to get total credits' });
  }
}

/**
 * Handles the uploading and processing of a user profile picture.
 * 
 * @route POST /server/v1/user/uploadPicture
 * @access Private
 * @returns {Promise<void>} JSON response with the new profile picture URL or an error message.
 * 
 * @throws {400} If no file is provided in the request.
 * @throws {401} If the user ID is missing from the request.
 * @throws {500} If a file system error or database update failure occurs.
 */
const uploadPicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = req.file.originalname.split('.').pop();
    const filename = `${req.userId}-${uniqueSuffix}.${fileExtension}`;

    const fs = require('fs');
    const path = require('path');
    
    const uploadDir = path.join(__dirname, '../public/uploads/pfps');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const sourcePath = req.file.path;
    const destPath = path.join(uploadDir, filename);
    
    fs.copyFileSync(sourcePath, destPath);
    
    fs.unlinkSync(sourcePath);

    const profilePicUrl = `/uploads/pfps/${filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: profilePicUrl },
      { new: true }
    );

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePic: updatedUser.profileImage
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
}


/**
 * Updates the notification and marketing preferences for the authenticated user.
 * 
 * @route PATCH /server/v1/user/notification-preferences
 * @access Private
 * @param {boolean} bonusOffers - Allow user to receive bonus offers
 * @param {boolean} gameUpdates - Allow user to receive game updates
 * @param {boolean} vipEvents - Invite user to vip events
 * @returns {Promise<void>} Returns success message if the update is completed
 */
const updatePreferences = async (req, res) => {
  try {
    const { bonusOffers, gameUpdates, vipEvents } = req.body;
    const userId = req.userId;

    if (
      (bonusOffers !== undefined && typeof bonusOffers !== 'boolean') ||
      (gameUpdates !== undefined && typeof gameUpdates !== 'boolean') ||
      (vipEvents !== undefined && typeof vipEvents !== 'boolean')
    ) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const updateFields = {};
    if (bonusOffers !== undefined) updateFields.bonusOffers = bonusOffers;
    if (gameUpdates !== undefined) updateFields.gameUpdates = gameUpdates;
    if (vipEvents !== undefined) updateFields.vipEvents = vipEvents;

    await User.findByIdAndUpdate(userId, updateFields)
      
    res.json({ 
      success: true, 
      message: 'Notifications updated successfully',
    });

  } catch (err) {
    console.error('Notifications update error:', err);
    res.status(500).json({ message: 'Failed to update notifications settings. Please try again.' });
  }
}


/**
 * Get user statistics including wagered amount, wins, rounds played, and favorite game
 * 
 * @route GET /server/v1/user/stats
 * @access Private
 * @returns {Object} User statistics object
 */
const getUserStats =  asyncHandler(async (req, res) => {
  const userId = req.userId;

  const [ gameStats, favoriteGame ] = await Promise.all([
    GameHistory.aggregate([
      { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) } },
      {
        $group: {
          _id: null,
          totalWagered: { $sum: '$betAmount' },
          totalWins: { $sum: '$winAmount' },
          totalRoundsPlayed: { $sum: 1 },
          // netProfit: { $sum: '$netProfit' }
        }
      }
    ]),

    GameHistory.aggregate([
      { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: '$gameType', count: { $sum: 1 } }},
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]),
  ]);

  res.status(200).json({
    stats: gameStats[0] || { totalWagered: 0, totalWins: 0, totalRoundsPlayed: 0 },
    favoriteGame: favoriteGame[0]?._id || 'None yet'
  });
});


/**
 * Get recent user game activity from the last month
 * 
 * @route  GET /server/v1/user/recent-activity
 * @access Private
 */
const getRecentActivity = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentGames = await userService.recentActivity(userId, 4, oneMonthAgo);

  res.status(200).json({ success: true, recentActivity: recentGames });
});


/**
 * Get game history for an user
 * 
 * @route  GET /server/v1/user/game-history
 * @access Private
 */
const getGameHistory = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { history, pagination } = await userService.gameHistory(userId, page, limit);

  res.status(200).json({
    success: true,
    history,
    pagination
  });
});


/**
 * Get users with optional filtering
 * 
 * @route GET /server/v2/users
 * @param {string} online - Filter by online status ('true' for online users only)
 * @param {string} vip - Filter by VIP status ('true' for VIP users only)
 * @param {number} limit - Maximum number of users to return
 * @param {string} sort - Sort field (default: 'username', options: 'username', 'totalCredits', 'lastSeen')
 * @returns {Promise<void>} JSON response indicating success, containg array of found users object and count of users found
 * @access Private
 */
const getUsers = asyncHandler(async(req, res) => {
  const { online, vip, limit, sort } = req.query;

  const users = await userService.getUsers({
    onlineOnly: online === 'true',
    vipOnly: vip === 'true',
    limit: limit ? parseInt(limit) : undefined,
    sortBy: sort || 'username'
  });

  res.status(200).json({ 
    success: true, 
    count: users.length, 
    users 
  });
});


/**
 * Get total credits for a specific user
 * @route GET /server/v2/users/:userId/credits
 * @access Private
 * @param {string} userId - User ID from URL params
 * @returns {Promise<void>} JSON response with user credits info object
 */
const getTotalCredits = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const userCredits = await userService.getTotalCredits(userId);

  res.status(200).json(userCredits);
});


/**
 * Get total credits for a specific user
 * @route GET /server/v2/users/register
 * @access Public
 * @returns {Promise<void>} JSON response with the new user object
 */
const registerUserV2 = asyncHandler(async (req, res) => {
  const userData = req.validatedData.body;

  const newUser = await userService.register(userData);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: newUser
  });
});

/**
 * Get user data when visiting user profile
 * 
 * @route GET /server/v2/users/:userId
 * @param {string} userId - Id of the user to be searched
 * @access Private
 * @returns {Promise<void>} JSON response with user data
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const currentUserId = req.userId;
  const targetUserId = req.params.userId;

  if (!targetUserId) {
    throw new ValidationError('User id is required');
  }

  const userData = await userService.getProfileById(targetUserId, currentUserId);

  return res.status(200).json(userData);
});

/**
 * Block user
 * 
 * @param {string} blockedId - Id of the user to be blocked
 * @route POST /server/v2/users/:userId/block
 * @access Private
 * @returns {Promise<void>} JSON response indicating success
 */
const blockUser = asyncHandler(async (req, res) => {
  const blockerId = req.userId;
  const blockedId = req.params.userId;

  if (blockerId === blockedId) {
    throw new ValidationError('You can\'t block yourself');
  }

  const userToBlock = await User.findById(blockedId);
  if (!userToBlock) {
    throw new NotFoundError('User not found');
  }

  // const existingBlock = await Blocking.findOne({ blockerId, blockedId });
  // if (existingBlock) {
  //   return res.status(409).json({ message: 'User is already blocked' });
  // }

  await Blocking.create({ blockerId, blockedId });

  return res.status(201).json({ message: 'User is blocked' });
});

/**
 * Unblock user
 * 
 * @param {string} blockedId - Id of the user to be unblocked
 * @route DELETE /server/v2/users/:userId/block
 * @access Private
 */
const unblockUser = asyncHandler(async (req, res) => {
  const blockerId = req.userId;
  const blockedId = req.params.userId;

  const result = await Blocking.findOneAndDelete({ blockerId, blockedId });

  if (!result) {
    return res.status(404).json({ message: 'User can\'t be unblocked'});
  }

  return res.status(200).json({ message: 'User is unblocked' });
});

/**
 * Get all the blocked users from the current user.
 * 
 * @route GET /server/v2/users/:userId/blocked
 * @access Private
 * @returns {Promise<void>} JSON response with array with all blocked users ids.
 */
const getBlockedUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.userId;

  const blockedUsers = await Blocking.find({ blockerId: currentUserId })
    .populate('blockedId', 'username firstName lastName profileImage')
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(blockedUsers);
});

module.exports = {
  registerUser,
  getProfile,
  updateTotalCredits,
  getTotalCreditsOld,
  uploadPicture,
  updatePreferences,
  getUserStats,
  getRecentActivity,
  getGameHistory,
  getUsers,
  getTotalCredits,
  registerUserV2,
  getUserProfile,
  blockUser,
  unblockUser,
  getBlockedUsers,
}