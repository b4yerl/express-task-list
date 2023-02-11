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

  
  res.status(201).json({ success: true });
}