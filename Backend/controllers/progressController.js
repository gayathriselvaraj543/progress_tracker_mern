const Progress = require('../models/progressModel');

exports.addProgress = async (req, res) => {
  try {
    const { category, value, reminder, notes, title, dueDate, completed } = req.body;
  
    if (!['home', 'knowledge', 'entertainment', 'health'].includes(category.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: home, knowledge, entertainment, health' 
      });
    }

    
    if (value < 0 || value > 100) {
      return res.status(400).json({ 
        message: 'Progress value must be between 0 and 100' 
      });
    }

    const progress = new Progress({
      userId: req.user._id,
      category: category.toLowerCase(),
      title,
      value,
      dueDate,
      completed: completed || false,
      reminder,
      notes
    });

    await progress.save();
    res.status(201).json({
      message: 'Progress added successfully',
      data: progress
    });
  } catch (error) {
    console.error('Error adding progress:', error);
    res.status(400).json({ 
      message: 'Failed to add progress',
      error: error.message 
    });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { category } = req.params;
    
    
    if (!['home', 'knowledge', 'entertainment', 'health'].includes(category.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: home, knowledge, entertainment, health' 
      });
    }

    const progress = await Progress.find({
      userId: req.user._id,
      category: category.toLowerCase()
    }).sort({ dueDate: 1 });

    // Calculate statistics
    let stats = {
      total: progress.length,
      completed: progress.filter(p => p.completed).length,
      pending: progress.filter(p => !p.completed).length,
      averageProgress: 0
    };

    if (progress.length > 0) {
      stats.averageProgress = Math.round(
        progress.reduce((sum, item) => sum + item.value, 0) / progress.length
      );
    }

    res.json({
      message: 'Progress retrieved successfully',
      data: progress,
      stats
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ 
      message: 'Failed to get progress',
      error: error.message 
    });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const { value, completed } = req.body;

    // Validate value if provided
    if (value !== undefined && (value < 0 || value > 100)) {
      return res.status(400).json({ 
        message: 'Progress value must be between 0 and 100' 
      });
    }

    const updateData = {};
    if (value !== undefined) updateData.value = value;
    if (completed !== undefined) updateData.completed = completed;

    const progress = await Progress.findOneAndUpdate(
      { _id: progressId, userId: req.user._id },
      updateData,
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ 
        message: 'Progress not found or you do not have permission to update it' 
      });
    }

    res.json({
      message: 'Progress updated successfully',
      data: progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(400).json({ 
      message: 'Failed to update progress',
      error: error.message 
    });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const { progressId } = req.params;
    const { reminder } = req.body;

    // Validate reminder date
    if (new Date(reminder) < new Date()) {
      return res.status(400).json({ 
        message: 'Reminder date must be in the future' 
      });
    }

    const progress = await Progress.findOneAndUpdate(
      { _id: progressId, userId: req.user._id },
      { reminder },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ 
        message: 'Progress not found or you do not have permission to update it' 
      });
    }

    res.json({
      message: 'Reminder updated successfully',
      data: progress
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(400).json({ 
      message: 'Failed to update reminder',
      error: error.message 
    });
  }
};
