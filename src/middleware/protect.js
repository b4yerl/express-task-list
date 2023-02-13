const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from req headers or from the stored cookie
  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }
  else if(req.cookies.token) {
    token = req.cookies.token;
  }

  if(!token) return next(new ErrorResponse('Not authenticated', 401))

  // Decode token to find the user
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authenticated', 401));
  }
});

module.exports = protect;