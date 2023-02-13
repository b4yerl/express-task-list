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

// @desc   Get single task
// @routes GET /api/v1/tasks/:id
// @access Private
exports.getSingleTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  // Verify task existence
  if(!task) return next(new ErrorResponse('Task not found', 404));

  // Verify if user is the task author
  if(task.user.toString() !== req.user.id)
    return next(new ErrorResponse('Not authorized to access this route', 403));
    
  res.status(200).json({ success: true, data: task});
});

// @desc   Change task status
// @routes PATCH /api/v1/tasks/:id/status
// @access Private
exports.changeStatus = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  // Verify task existence
  if(!task) return next(new ErrorResponse('Task not found', 404));

  // Verify if user is the task author
  if(task.user.toString() !== req.user.id)
    return next(new ErrorResponse('Not authorized to access this route', 403));
  
  // Change status then save it
  if(task.status === 'pending') {
    task.status = 'complete' 
  }
  else {
    task.status = 'pending'
  }

  await task.save();

  res.status(200).json({ success: true, data: task });
});

// @desc   Update task details
// @routes PATCH /api/v1/tasks/:id
// @access Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  // Verify task existence
  if(!task) return next(new ErrorResponse('Task not found', 404));

  // Verify if user is the task author
  if(task.user.toString() !== req.user.id)
    return next(new ErrorResponse('Not authorized to access this route', 403));
  
  const { title, description, status } = req.body
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id, 
    {
      title,
      description,
      status
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({ success: true, data: updatedTask });
});