import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Tasks</h2>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks yet. Add one above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="task-item group"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) =>
                    onUpdateTask(task._id, { completed: e.target.checked })
                  }
                  className="checkbox-input"
                />
                <div>
                  <p className={`font-medium ${
                    task.completed 
                      ? 'line-through text-gray-400' 
                      : 'text-gray-800'
                  }`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDeleteTask(task._id)}
                className="delete-button opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Delete task"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
