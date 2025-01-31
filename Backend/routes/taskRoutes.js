const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
  getCategories,
  getLabels,
  getTasksNeedingUpdate,
  testUpdateReminder
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Create new task
router.post('/', createTask);

// Get all tasks with filtering and search
router.get('/', getTasks);

// Get task statistics
router.get('/stats', getTaskStats);

// Get available categories
router.get('/categories', getCategories);

// Get available labels
router.get('/labels', getLabels);

// Get tasks needing updates
router.get('/needs-update', getTasksNeedingUpdate);

// Test update reminder
router.post('/test-update-reminder', testUpdateReminder);

// Update task
router.patch('/:id', updateTask);

// Delete task
router.delete('/:id', deleteTask);

module.exports = router;
