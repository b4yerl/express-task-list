const express = require('express');
const { createTask } = require('../controllers/tasks');

// Import authentication middleware
const protect  = require('../middleware/protect');

const router = express.Router();

router.route('/')
  .post(protect, createTask)

module.exports = router;