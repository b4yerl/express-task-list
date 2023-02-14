const express = require('express');
const { 
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/auth');

// Import authentication middleware
const protect = require('../middleware/protect');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/update/details', protect, updateDetails);
router.patch('/update/password', protect, updatePassword);
router.patch('/reset/:token', resetPassword);

module.exports = router;