const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
  try {
    const user = new User({
      firstName,
      lastName, 
      userName, 
      email,
      password, 
      registrationDate, 
      country, 
      city, 
      phoneNumber})
      await user.save()
      res.status(201).json({ message: "User registered successfully "})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const login = async (req, res) => {
  try {
    const {userName, password} = req.body

    const user = await User.findOne({ userName })
    if(!user) {
      return res.status(401).json({ message: 'Could\'nt find user with that username'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password'});
    }

    const token = user.createJWT();

    res.json({ message: 'Login successful', token});
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  register,
  login
}