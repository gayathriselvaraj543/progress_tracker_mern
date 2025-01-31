const express = require('express');
const router = express.Router();
const {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder
} = require('../controllers/reminderController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Create new reminder
router.post('/', createReminder);

// Get all reminders
router.get('/', getReminders);

// Update reminder
router.patch('/:id', updateReminder);

// Delete reminder
router.delete('/:id', deleteReminder);

module.exports = router;
