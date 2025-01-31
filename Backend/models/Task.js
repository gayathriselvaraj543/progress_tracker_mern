const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['work', 'personal', 'shopping', 'health', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  labels: [{
    type: String,
    trim: true
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updateReminderDays: {
    type: Number,
    default: 7 // Default reminder after 7 days of no updates
  },
  needsUpdate: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add text index for search functionality
taskSchema.index({ title: 'text', category: 'text', labels: 'text' });

// Add method to check if task needs update
taskSchema.methods.checkNeedsUpdate = function() {
  if (!this.lastUpdated) return false;
  const daysSinceUpdate = Math.floor((Date.now() - this.lastUpdated) / (1000 * 60 * 60 * 24));
  return daysSinceUpdate >= this.updateReminderDays;
};

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
