const User = require('../models/User');

const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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

// @desc   Get current logged in user
// @routes GET /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// @desc   Update user details
// @routes PATCH /api/v1/auth/update/details
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  // Isolates only allowed fields to update
  const { email, username } = req.body;
  
  const user = await User.findByIdAndUpdate(req.user.id, { email, username }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});

// @desc   Update user password
// @routes PATCH /api/v1/auth/update/password
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id)
    .select('+password');

  // Verify current user password as a safety measure
  if(!(await user.matchPasswords(currentPassword))) {
    return next(new ErrorResponse('Incorrect password', 403));
  }

  user.password = newPassword;
  await user.save();

  getTokenSendResponse(user, 200, res);
});

// @desc   Send email to reset password
// @routes POST /api/v1/auth/forgot-password
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if(!user) return next(new ErrorResponse('User not found', 404));

  // Get token and send both hash and expire limit to current user
  const token = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url and message
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset/${token}`;
  const text = `To reset your password please visit: \n ${resetUrl}`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Password reset',
      text
    });

    res.status(200).json({ success: true, data: `Email sent to ${req.body.email}`});
  } catch(err) {
    console.log(err.message);

    // Reset user document fields and save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Failed to send email', 500));
  }
});

// @desc   Reset password
// @routes PATCH /api/v1/auth/reset/:token
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hash = crypto.createHash('sha256').update(req.params.token).digest('hex');

  // Checks for user with the same hashed token and expire date greater than now
  const user = await User.findOne({
    resetPasswordToken: hash,
    resetPasswordExpire: { $gt: new Date() }
  });

  if(!user) return next(new ErrorResponse('Invalid token', 400));

  // Reset password and control fields
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  getTokenSendResponse(user, 200, res);
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
};
