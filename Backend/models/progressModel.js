const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['home', 'knowledge', 'entertainment', 'health']
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  reminder: {
    type: Date,
    required: false
  },
  notes: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Progress', progressSchema);
