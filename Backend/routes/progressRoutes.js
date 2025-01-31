const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  addProgress, 
  getProgress, 
  updateProgress,
  updateReminder 
} = require('../controllers/progressController');

// Create a new progress entry
router.post('/', auth, addProgress);

// Get progress entries by category
router.get('/:category', auth, getProgress);

// Update progress value and completion status
router.patch('/:progressId', auth, updateProgress);

// Update reminder
router.patch('/:progressId/reminder', auth, updateReminder);

module.exports = router;
