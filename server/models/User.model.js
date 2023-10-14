const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'You must provide a first name'],
    minLength: 2,
    maxLength: 20,
  },
  lastName: {
    type: String,
    required: [true, 'You must provide a last name'],
    minLength: 2,
    maxLength: 20,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'You must provide an email'],
    trim: true,
    match: [
      /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
      "You must provide a valid email",
    ]
  },
  password: {
    type: String,
    bcrypt: true,
    minLength: 6,
    required: [true, 'Password can\'t be empty'],
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  city: {
    type: String,
    default: 'Unknown'
  },
  phoneNumber: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "You must provide a phone number"],
    match: [/^08\d{8}$/, "Invalid phone number format"],
  },
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
