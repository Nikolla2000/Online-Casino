const User = require('../models/User.model');

const register = async(req, res) => {
  const {
    firstName,
    lastName, 
    userName, 
    emailk,
    password, 
    registrationDate, 
    country, 
    city, 
    phoneNumber
  } = req.body;

  try {
    const user = new User({firstName,
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

module.exports = {
  register
}