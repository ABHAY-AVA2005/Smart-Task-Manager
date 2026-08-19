import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = new Task({
    user: req.user._id,
    title,
    description,
    status: status || 'Todo',
    priority: priority || 'Medium',
    dueDate,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

// @desc    Get all tasks for logged in user (with filtering, sorting)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sortBy } = req.query;

  let query = { user: req.user._id };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.title = { $regex: search, $options: 'i' };

  let sortCriteria = { createdAt: -1 };
  if (sortBy === 'dueDate') sortCriteria = { dueDate: 1 };
  if (sortBy === 'priority') sortCriteria = { priority: -1 }; // high to low roughly? we might need custom sort or just leave it simple

  const tasks = await Task.find(query).sort(sortCriteria);
  res.json(tasks);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found or not authorized');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    await Task.deleteOne({ _id: task._id });
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found or not authorized');
  }
});

// @desc    Get task analytics
// @route   GET /api/tasks/analytics
// @access  Private
const getTaskAnalytics = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Done').length;
  const pending = total - completed;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  res.json({
    total,
    completed,
    pending,
    completionPercentage,
  });
});

export { createTask, getTasks, updateTask, deleteTask, getTaskAnalytics };
