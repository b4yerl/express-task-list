const express = require('express');
const {
  createTask,
  getAllTasks,
  getSingleTask,
  changeStatus,
  updateTask
} = require('../controllers/tasks');
const Task = require('../models/Task');

// Import authentication and query middleware
const protect  = require('../middleware/protect');
const advancedResults = require('../middleware/query');

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(protect, advancedResults(Task), getAllTasks)

router.route('/:id')
  .get(protect, getSingleTask)
  .patch(protect, updateTask)

router.patch('/:id/status', protect, changeStatus);

module.exports = router;