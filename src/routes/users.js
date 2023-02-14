const express = require('express');
const {
  getAllUsers,
  getSingleUser
} = require('../controllers/users');

const router = express.Router();

// Import middleware
const protect = require('../middleware/protect');
const checkAdmin = require('../middleware/checkAdmin');
const advancedResults = require('../middleware/query');

router.route('/')
  .get(protect, checkAdmin, getAllUsers)

router.route('/:id')
  .get(protect, getSingleUser)

module.exports = router;