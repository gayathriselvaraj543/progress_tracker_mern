import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

const AddTask = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Progress keywords that will trigger navigation
  const progressKeywords = {
    'home progress': { path: '/progress/home', category: 'home' },
    'knowledge progress': { path: '/progress/knowledge', category: 'knowledge' },
    'entertainment progress': { path: '/progress/entertainment', category: 'entertainment' },
    'health progress': { path: '/progress/health', category: 'health' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    const lowerTitle = title.toLowerCase().trim();
    
    // Check if the title matches any progress keywords
    for (const [keyword, { path, category }] of Object.entries(progressKeywords)) {
      if (lowerTitle === keyword) {
        try {
          // Get the token from localStorage
          const token = localStorage.getItem('token');
          if (!token) {
            setError('Please log in to add progress');
            return;
          }

          // Create a progress task
          const response = await axios.post(`${config.apiUrl}/api/progress`, {
            category,
            value: 0, // Initial progress value
            dueDate: new Date(dueDate),
            title: title.trim(),
            completed: false
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.data) {
            // Navigate to the progress page with the new task
            navigate(path, { 
              state: { 
                newTask: response.data.data,
                message: 'Progress task added successfully!' 
              } 
            });
            setTitle('');
            setDueDate('');
          }
        } catch (error) {
          console.error('Error creating progress:', error);
          setError(error.response?.data?.message || 'Failed to create progress task. Please try again.');
        }
        return;
      }
    }

    // If not a progress task, proceed with normal task creation
    try {
      await onAddTask({
        title: title.trim(),
        dueDate: new Date(dueDate),
      });
      setTitle('');
      setDueDate('');
    } catch (error) {
      setError('Failed to add task. Please try again.');
    }
  };

  // Helper function to check if input matches any progress keyword
  const checkProgressKeyword = (input) => {
    const lowerInput = input.toLowerCase();
    return Object.keys(progressKeywords).some(keyword => 
      lowerInput === keyword
    );
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Task</h2>
      {error && (
        <div className="error-text mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Enter task title (e.g., 'home progress')"
            data-has-progress={checkProgressKeyword(title)}
          />
          {checkProgressKeyword(title) && (
            <div className="progress-hint">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span>Add a due date to track your progress</span>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <button 
          type="submit" 
          className="submit-button"
        >
          {checkProgressKeyword(title) ? 'Add Progress Task' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
