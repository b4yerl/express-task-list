const User = require('../models/User');

const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const pagination = require('../middleware/pagination');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  // Since we may have a lot of registered users
  // it may be important to apply pagination on our data
  const data = pagination(req, users);
  
  res.status(200).json(data);
});