const mongoose = require('mongoose');

const TaskSchema =  mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Add a title to the task'],
    maxlength: [40, 'Title must have less than 40 characters']
  },
  description: {
    type: String,
    maxlength: [140, 'Description must have less than 140 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'complete'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Task', TaskSchema);