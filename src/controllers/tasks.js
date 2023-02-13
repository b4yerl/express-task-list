const Task = require('../models/Task');

const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc   Create a new task
// @routes POST /api/v1/tasks
// @access Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // Assign signed in user to request body
  req.body.user = req.user.id;

  const task = await Task.create(req.body);

  res.status(201).json({ success: true, data: task });
});

// @desc   Get all tasks
// @routes GET /api/v1/tasks
// @access Private
exports.getAllTasks = asyncHandler(async (req, res, next) => {
  // Sends back the results coming from the query middleware
  res.status(200).json(res.results);
});