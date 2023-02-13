const express = require('express');
const {
  createTask,
  getAllTasks
} = require('../controllers/tasks');

// Import authentication middleware
const protect  = require('../middleware/protect');

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(protect, getAllTasks)

module.exports = router;