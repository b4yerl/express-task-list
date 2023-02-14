const User = require('../models/User');

const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const checkAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if(user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this route', 403));
  }

  next();
});

module.exports = checkAdmin;