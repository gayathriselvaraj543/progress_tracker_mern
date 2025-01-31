import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
const ProgressChart = ({ stats }) => {
  if (!stats) return null;
  const doughnutData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [stats.completedTasks, stats.pendingTasks],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderColor: ['#059669', '#D97706'],
        borderWidth: 1,
      },
    ],
  };
  const completionRate = stats.completionRate.toFixed(1);
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
      <div className="space-y-6">
        <div className="flex justify-around items-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalTasks}</p>
            <p className="text-gray-600">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary">{completionRate}%</p>
            <p className="text-gray-600">Completion Rate</p>
          </div>
        </div>
        
        <div className="w-full h-64 flex items-center justify-center">
          <div className="w-48">
            <Doughnut
              data={doughnutData}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                cutout: '70%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgressChart;
