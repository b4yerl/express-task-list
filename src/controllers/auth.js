const User = require('../models/User');

const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse');

// @desc   Register a user
// @routes POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  // Isolate these fields prventing the user to changing something we don't want to
  const { username, email, password} = req.body;
  const userParams = {
    username,
    email,
    password
  }

  // Register user using only the fields previously selected
  const user = await User.create(userParams);

  
  getTokenSendResponse(user, 201, res);
});

// @desc   Login user
// @routes POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email })
    .select('+password');

  if(!user) return next(new ErrorResponse('Invalid Credentials', 401));

  const isMatch = await user.matchPasswords(password);

  if(!isMatch) return next(new ErrorResponse('Invalid Credentials', 401));
  
  getTokenSendResponse(user, 200, res);
});

// @desc   Logout current User
// @routes GET /api/v1/auth/logout
// @access Public
exports.logout = asyncHandler(async (req, res, next) => {
  const tenSeconds = 10 * 1000

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + tenSeconds),
    httpOnly: true
  });

  res.status(200).json({ success: true });
});

// Set up cookie and send back token response
const getTokenSendResponse = (user, statusCode, res) => {
  
  // Get JWT
  const token = user.getJwt();

  // Define cookie options
  const daysInMilliseconds = process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000;

  const options = {
    expires: new Date(Date.now() + daysInMilliseconds),
    httpOnly: true
  };

  if(process.env.NODE_ENV === 'production') options.secure = true; 

  // Send back response including the cookie
  res.status(statusCode).cookie('token', token, options).json({ success: true, token})
} 