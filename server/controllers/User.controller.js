const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const { hashPassword, comparePasswords} = require('../helpers/auth');
const asyncHandler = require('../helpers/asyncHandler');
const GameHistory = require('../models/GameHistory.model');
const { default: mongoose } = require('mongoose');


//List all registered users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


//Register Endpoint
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


//Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user) {
      return res.json({ error: 'User with this email is not found' })
    }

    const match = await comparePasswords(password, user.password)
    if (match) {
      jwt.sign(
        { email: user.email, id: user._id, name: user.firstName },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) {
            res.status(500).json({ error: 'Failed to create a token' });
          } else {
            res.cookie('token', token, {
              httpOnly: true,
              sameSite: 'None',
              secure: true
            }).json(user);
          }
        }
      );
    }
    
    if(!match) {
      res.json({ error: 'Passwords do not match' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}


//Logout
const logoutUser = (req, res) => {
  res.clearCookie('token').json({ message: 'Logout successfull' });
  res.redirect('/');
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


//Update total credits
const updateTotalCredits = async (req, res) => {
  const { userId, totalCredits} = req.body

  try {
    const userToUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { totalCredits: totalCredits } },
      { new: true }
    ).lean();

    res.status(200).json({ message: 'Total credits updated successfully', user: userToUpdate });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const getTotalCredits = async (req, res) => {
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


const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await User.find(
      {isOnline: true},
      'username email profileImage totalCredits isVip lastSeen'
    )
    .sort({ username: 1 })
    .lean();
  
    res.status(200).json({ success: true, count: onlineUsers.length, users: onlineUsers });
  } catch (err) {
    res.status(500).json({  message: err.message })
  }
}


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
 * Get user stats
 * POST /server/v1/user/stats
 * ACCESS: Private
 * Body: {}
 * Returns { favoriteGame: string }
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
})


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getProfile,
  updateTotalCredits,
  getTotalCredits,
  uploadPicture,
  getOnlineUsers,
  updatePreferences,
  getUserStats,
}