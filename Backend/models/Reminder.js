const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reminderTime: {
    type: Date,
    required: true
  },
  notificationType: {
    type: String,
    enum: ['email', 'push'],
    default: 'email'
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  repeat: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Index for querying pending reminders efficiently
reminderSchema.index({ status: 1, reminderTime: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;
