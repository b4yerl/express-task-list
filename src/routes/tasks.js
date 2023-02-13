const express = require('express');
const {
  createTask,
  getAllTasks
} = require('../controllers/tasks');
const Task = require('../models/Task');

// Import authentication and query middleware
const protect  = require('../middleware/protect');
const advancedResults = require('../middleware/query');

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(protect, advancedResults(Task), getAllTasks)

module.exports = router;