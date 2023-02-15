const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
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
    minlength: [8, 'Password must have at least 8 characters'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W|.*_).*$/,
      'Password must have at least one lower case letter, one upper case letter, a number and a special character'
    ],
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

// Cascade delete
UserSchema.pre('remove', async function(next) {
  await this.model('Task').deleteMany({ user: this._id });
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

// Generate reset password token
UserSchema.methods.getResetPasswordToken = function() {
  // Create the reset password token
  const token = crypto.randomBytes(20).toString('hex');
  const tenMinutes = 10 * 60 * 1000;

  // Hash the token to store it and define a 10 minutes expire limit
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpire = new Date(Date.now() + tenMinutes);

  // Return original token to be sent within the email
  return token;
}

module.exports = mongoose.model('User', UserSchema);