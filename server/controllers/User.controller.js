const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { hashPassword, comparePasswords} = require('../helpers/auth')

const register = async(req, res) => {
  const {
    firstName,
    lastName, 
    userName, 
    email,
    password,
    confirmPassword,
    registrationDate, 
    country, 
    city, 
    phoneNumber
  } = req.body;

  if (
    !firstName 
    || !lastName 
    || !userName 
    || !email 
    || !password
    || !confirmPassword) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if(password !== confirmPassword){
      res.status(400).json({ message: 'Passwords do not match'})
    }

    const hashedPassword = await hashPassword(password)
  try {
    const user = new User({
      firstName,
      lastName, 
      userName, 
      email,
      password: hashedPassword, 
      registrationDate, 
      country, 
      city, 
      phoneNumber})

      await user.save()

      const token = jwt.sign({ userId: user_id, username: user.userName}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      })
      res.status(201).json({ message: "User registered successfully "})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const login = async (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }

    if(!user) {
      return res.status(401).json({ message: info.message });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err)
      }

      const token = user.createJWT();
      res.json({ message: 'Login successful', token})
    })
  })(req, res, next);
}

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
    if(match) {
      jwt.sign({ email: user.email, id: user._id, name: user.firstName }, process.env.JWT_SECRET, 
      {}, (error, token) => {
        if(error) throw error;
        res.cookie('token', token).json(user)
      })
    }
    if(!match) {
      res.json({ error: 'Passwords do not match' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
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
    res.json(null)
}
}

module.exports = {
  register,
  registerUser,
  login,
  loginUser,
  getAllUsers
}