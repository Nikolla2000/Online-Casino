const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { hashPassword, comparePasswords} = require('../helpers/auth');


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

      const hashedPassword = await hashPassword(password)

      const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        registrationDate,
        country,
        phoneNumber,
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
  const { id } = req.query;

  try {
    const user = await User.findOne({ _id: id }, 'totalCredits');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ totalCredits: user.totalCredits });r
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getProfile,
  updateTotalCredits,
  getTotalCredits
}