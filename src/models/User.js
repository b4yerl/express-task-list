const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    maxlength: [30, 'Username must have less than 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must have at least 6 characters'],
    // match: a-z A-Z 0-9 !-?
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password using bcryptjs
UserSchema.pre('save', async function(next) {
  // Prevent password hashing every time other user info is updated
  if(!this.isModified('password')) next();

  const salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);

  next();
});

// Match input password to the database one
UserSchema.methods.matchPasswords = async function(input) {
  return await bcryptjs.compare(input, this.password);
};

// Get JWT and Return it
UserSchema.methods.getJwt = function() {
  return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', UserSchema);