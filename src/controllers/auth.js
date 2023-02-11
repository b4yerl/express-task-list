const User = require('../models/User');

// @desc   Register a user
// @routes POST /api/v1/auth/register
// @access Public
exports.register = async (req, res, next) => {
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
};

// Set up cookie and send back token response
const getTokenSendResponse = (user, statusCode, res) => {
  
  // Get JWT
  const token = user.getJwt();

  // Define cookie options
  const daysInMilliseconds = process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000;

  const options = {
    expires: new Date().now + daysInMilliseconds,
    httpOnly: true
  };

  if(process.env.NODE_ENV === 'production') options.secure = true; 

  // Send back response including the cookie
  res.status(statusCode).cookie('token', token, options).json({ success: true, token})
} 