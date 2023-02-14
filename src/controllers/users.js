const User = require('../models/User');

const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const pagination = require('../utils/pagination');

// @desc   Get all users
// @routes GET /api/v1/users
// @access Private (admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  // Since we may have a lot of registered users
  // it may be important to apply pagination on our data
  const data = pagination(req, users);
  
  res.status(200).json(data);
});

// @desc   Get single user
// @routes GET /api/v1/users/:id
// @access Private (admin)
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user) return next(new ErrorResponse('User not found', 404));
  
  res.status(200).json({ success: true, data: user });
});

// @desc   Update user details
// @routes PATCH /api/v1/users/:id
// @access Private (admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Don't allow admin to update user's password
  const { email, username } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { email, username}, {
    new: true,
    runValidators: true
  });

  if(!user) return next(new ErrorResponse('User not found', 404));
  
  res.status(200).json({ success: true, data: user });
});

// @desc   Delete user
// @routes DELETE /api/v1/users/:id
// @access Private (admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  // Verify user existence
  if(!user) return next(new ErrorResponse('User not found', 404));

  await User.findByIdAndDelete(req.params.id);
  
  res.status(200).json({ success: true, data: user });
});
