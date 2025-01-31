const Task = require('../models/Task');

// Create task
const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tasks for a user with filtering and search
const getTasks = async (req, res) => {
  try {
    const match = { user: req.user._id };
    const sort = {};

    // Search functionality
    if (req.query.search) {
      match.$text = { $search: req.query.search };
    }

    // Filter by category
    if (req.query.category) {
      match.category = req.query.category;
    }

    // Filter by priority
    if (req.query.priority) {
      match.priority = req.query.priority;
    }

    // Filter by completion status
    if (req.query.completed) {
      match.completed = req.query.completed === 'true';
    }

    // Filter by labels
    if (req.query.label) {
      match.labels = req.query.label;
    }

    // Sorting
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.dueDate = 1;
    }

    const tasks = await Task.find(match).sort(sort);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'completed', 'dueDate', 'updateReminderDays'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    updates.forEach(update => task[update] = req.body[update]);
    task.lastUpdated = new Date(); // Update the lastUpdated timestamp
    task.needsUpdate = false; // Reset the needsUpdate flag
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ user: req.user._id });
    const completedTasks = await Task.countDocuments({ 
      user: req.user._id,
      completed: true
    });
    const pendingTasks = totalTasks - completedTasks;

    // Get daily completion stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Task.aggregate([
      {
        $match: {
          user: req.user._id,
          updatedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
            completed: "$completed"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      dailyStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get task categories
const getCategories = async (req, res) => {
  try {
    const categories = await Task.distinct('category', { user: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get task labels
const getLabels = async (req, res) => {
  try {
    const labels = await Task.distinct('labels', { user: req.user._id });
    res.json(labels.filter(label => label)); // Remove null/empty values
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check tasks that need updates
const checkTasksForUpdates = async () => {
  try {
    const tasks = await Task.find({ completed: false });
    for (const task of tasks) {
      const needsUpdate = task.checkNeedsUpdate();
      if (needsUpdate !== task.needsUpdate) {
        task.needsUpdate = needsUpdate;
        await task.save();
      }
    }
  } catch (error) {
    console.error('Error checking tasks for updates:', error);
  }
};

// Get tasks that need updates
const getTasksNeedingUpdate = async (req, res) => {
  try {
    const tasks = await Task.find({ 
      user: req.user._id,
      completed: false,
      needsUpdate: true 
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Test update reminder (temporary endpoint for testing)
const testUpdateReminder = async (req, res) => {
  try {
    // Create a test task with lastUpdated set to 8 days ago
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const task = new Task({
      title: "Test Task for Update Reminder",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      user: req.user._id,
      lastUpdated: eightDaysAgo
    });

    await task.save();
    
    // Run the update check manually
    await checkTasksForUpdates();

    res.json({
      message: "Test task created with old update date",
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Set up interval to check for tasks needing updates (run every day)
setInterval(checkTasksForUpdates, 24 * 60 * 60 * 1000);

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
  getCategories,
  getLabels,
  getTasksNeedingUpdate,
  testUpdateReminder
};
