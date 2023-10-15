const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

passport.use({ usernameField: 'username'}, async (userName, password, done) => {
try {
  const user = await User.findOne({ userName });

  if(!user) {
    return done (null, false, { message: 'User with this username is not found'});
  }

  const isPasswordValid = await bcrypt.compare(passport, user.password);

  if(!isPasswordValid) {
    return done (null, false, { message: 'Invalid password'});
  }

  return done(null, user)
} catch (error) {
  return done(error)
}
})

module.exports = passport;