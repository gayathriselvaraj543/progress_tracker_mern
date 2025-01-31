const Reminder = require('../models/Reminder');
const Task = require('../models/Task');

// Create reminder
const createReminder = async (req, res) => {
  try {
    // Verify task exists and belongs to user
    const task = await Task.findOne({
      _id: req.body.task,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const reminder = new Reminder({
      ...req.body,
      user: req.user._id,
      notificationType: 'push' // Default to push notifications for now
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reminders for a user
const getReminders = async (req, res) => {
  try {
    const match = { user: req.user._id };
    const sort = { reminderTime: 1 };

    // Filter by status
    if (req.query.status) {
      match.status = req.query.status;
    }

    // Filter by task
    if (req.query.task) {
      match.task = req.query.task;
    }

    const reminders = await Reminder.find(match)
      .sort(sort)
      .populate('task', 'title dueDate');

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update reminder
const updateReminder = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['reminderTime', 'repeat'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    updates.forEach(update => reminder[update] = req.body[update]);
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete reminder
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process pending reminders
const processPendingReminders = async () => {
  try {
    const now = new Date();
    const pendingReminders = await Reminder.find({
      status: 'pending',
      reminderTime: { $lte: now }
    }).populate('task user');

    for (const reminder of pendingReminders) {
      try {
        // Log notification (since we can't send emails/push notifications yet)
        console.log(`[REMINDER] Task: ${reminder.task.title} for user: ${reminder.user.email}`);
        
        // Update reminder status
        reminder.status = 'sent';
        
        // Handle recurring reminders
        if (reminder.repeat !== 'none') {
          const newReminderTime = new Date(reminder.reminderTime);
          switch (reminder.repeat) {
            case 'daily':
              newReminderTime.setDate(newReminderTime.getDate() + 1);
              break;
            case 'weekly':
              newReminderTime.setDate(newReminderTime.getDate() + 7);
              break;
            case 'monthly':
              newReminderTime.setMonth(newReminderTime.getMonth() + 1);
              break;
          }
          
          // Create next reminder
          await Reminder.create({
            task: reminder.task._id,
            user: reminder.user._id,
            reminderTime: newReminderTime,
            notificationType: 'push',
            repeat: reminder.repeat
          });
        }

        await reminder.save();
      } catch (error) {
        reminder.status = 'failed';
        await reminder.save();
        console.error(`Failed to process reminder ${reminder._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing reminders:', error);
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  processPendingReminders
};
