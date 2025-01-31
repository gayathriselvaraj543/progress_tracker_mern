import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';
import { config } from '../../config';
import './ProgressTracker.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getProgressColor = (category) => {
  const colors = {
    Home: '#4299E1',      
    Knowledge: '#48BB78',  
    Entertainment: '#F6AD55', 
    Health: '#F56565'      
  };
  return colors[category] || '#4299E1';
};

const ProgressTracker = ({ category }) => {
  const [progressItems, setProgressItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    averageProgress: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProgress, setNewProgress] = useState({
    value: 0,
    notes: '',
    reminder: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: `${category} Progress`,
      data: [],
      fill: false,
      borderColor: getProgressColor(category),
      backgroundColor: getProgressColor(category, 0.2),
      tension: 0.1
    }]
  });

  useEffect(() => {
    fetchProgressData();
  }, [category]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view progress');
      }

      const response = await axios.get(
        `${config.apiUrl}/api/progress/${category.toLowerCase()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const { data, stats } = response.data;
      setProgressItems(data);
      setStats(stats);

      // Update chart data
      const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
      setChartData({
        labels: sortedData.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [{
          label: `${category} Progress`,
          data: sortedData.map(item => item.value),
          fill: false,
          borderColor: getProgressColor(category),
          backgroundColor: getProgressColor(category, 0.2),
          tension: 0.1
        }]
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to add progress');
      }

      await axios.post(
        `${config.apiUrl}/api/progress`,
        {
          category: category.toLowerCase(),
          ...newProgress
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setShowAddForm(false);
      setNewProgress({ value: 0, notes: '', reminder: '' });
      fetchProgressData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateProgress = async (id, updates) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to update progress');
      }

      await axios.patch(
        `${config.apiUrl}/api/progress/${id}`,
        updates,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      fetchProgressData();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading {category} progress...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h2>{category} Progress</h2>
        <button 
          className="add-progress-button"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Progress
        </button>
      </div>

      <div className="progress-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>Average Progress</h3>
          <p>{stats.averageProgress}%</p>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddProgress} className="add-progress-form">
          <div className="form-group">
            <label>Progress Value (0-100%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newProgress.value}
              onChange={(e) => setNewProgress({
                ...newProgress,
                value: parseInt(e.target.value)
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={newProgress.notes}
              onChange={(e) => setNewProgress({
                ...newProgress,
                notes: e.target.value
              })}
            />
          </div>
          <div className="form-group">
            <label>Set Reminder</label>
            <input
              type="datetime-local"
              value={newProgress.reminder}
              onChange={(e) => setNewProgress({
                ...newProgress,
                reminder: e.target.value
              })}
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-button">Add Progress</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="progress-chart">
        <Line data={chartData} />
      </div>

      <div className="progress-list">
        {progressItems.map(item => (
          <div key={item._id} className="progress-item">
            <div className="progress-info">
              <h3>{item.title}</h3>
              <p>Due: {new Date(item.dueDate).toLocaleDateString()}</p>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${item.value}%` }}
                />
                <span>{item.value}%</span>
              </div>
            </div>
            <div className="progress-actions">
              <button
                onClick={() => handleUpdateProgress(item._id, { completed: !item.completed })}
                className={`complete-button ${item.completed ? 'completed' : ''}`}
              >
                {item.completed ? 'Completed' : 'Mark Complete'}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={item.value}
                onChange={(e) => handleUpdateProgress(item._id, { value: parseInt(e.target.value) })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
