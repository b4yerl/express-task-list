const express = require('express');
const { 
  register,
  login,
  logout,
  getMe,
  updateDetails
} = require('../controllers/auth');

// Import authentication middleware
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/update/details', protect, updateDetails)

module.exports = router;