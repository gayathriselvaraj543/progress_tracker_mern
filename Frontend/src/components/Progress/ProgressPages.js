import React, { useState } from 'react';
import './ProgressPages.css';

const ProgressCard = ({ title, value, icon, description, onUpdate }) => {
  return (
    <div className="progress-card">
      <div className="progress-card-header">
        <span className="progress-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <p>{description}</p>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${value}%` }}></div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onUpdate(parseInt(e.target.value))}
        className="progress-slider"
      />
      <span className="progress-value">{value}%</span>
    </div>
  );
};

const TaskList = ({ tasks, onToggle }) => {
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div key={index} className="task-item">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(index)}
          />
          <span className={task.completed ? 'completed' : ''}>{task.text}</span>
        </div>
      ))}
    </div>
  );
};

export const HomeProgress = () => {
  const [cleaningProgress, setCleaningProgress] = useState(0);
  const [organizationProgress, setOrganizationProgress] = useState(0);
  const [maintenanceProgress, setMaintenanceProgress] = useState(0);
  const [tasks, setTasks] = useState([
    { text: 'Clean living room', completed: false },
    { text: 'Organize closet', completed: false },
    { text: 'Check smoke detectors', completed: false },
    { text: 'Water plants', completed: false }
  ]);

  const toggleTask = (index) => {
    setTasks(tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>🏠 Home Progress</h1>
        <p>Track and manage your home maintenance tasks</p>
      </div>
      
      <div className="progress-grid">
        <ProgressCard
          title="Cleaning"
          value={cleaningProgress}
          icon="🧹"
          description="Daily and weekly cleaning tasks"
          onUpdate={setCleaningProgress}
        />
        <ProgressCard
          title="Organization"
          value={organizationProgress}
          icon="📦"
          description="Home organization and decluttering"
          onUpdate={setOrganizationProgress}
        />
        <ProgressCard
          title="Maintenance"
          value={maintenanceProgress}
          icon="🔧"
          description="Regular home maintenance tasks"
          onUpdate={setMaintenanceProgress}
        />
      </div>

      <div className="tasks-section">
        <h2>Today's Tasks</h2>
        <TaskList tasks={tasks} onToggle={toggleTask} />
      </div>

      <div className="tips-section">
        <h2>Home Care Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span>🧹</span>
            <h3>Daily Cleaning</h3>
            <p>Spend 15 minutes each day on quick cleaning tasks</p>
          </div>
          <div className="tip-card">
            <span>📋</span>
            <h3>Maintenance Schedule</h3>
            <p>Create a monthly maintenance checklist</p>
          </div>
          <div className="tip-card">
            <span>✨</span>
            <h3>Organization</h3>
            <p>Declutter one small area each week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KnowledgeProgress = () => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [coursesProgress, setCoursesProgress] = useState(0);
  const [projectsProgress, setProjectsProgress] = useState(0);
  const [tasks, setTasks] = useState([
    { text: 'Read 30 minutes', completed: false },
    { text: 'Complete online course module', completed: false },
    { text: 'Practice coding', completed: false },
    { text: 'Review study notes', completed: false }
  ]);

  const toggleTask = (index) => {
    setTasks(tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>📚 Knowledge Progress</h1>
        <p>Track your learning journey</p>
      </div>

      <div className="progress-grid">
        <ProgressCard
          title="Reading"
          value={readingProgress}
          icon="📖"
          description="Books and articles progress"
          onUpdate={setReadingProgress}
        />
        <ProgressCard
          title="Courses"
          value={coursesProgress}
          icon="💻"
          description="Online courses progress"
          onUpdate={setCoursesProgress}
        />
        <ProgressCard
          title="Projects"
          value={projectsProgress}
          icon="🎯"
          description="Personal projects progress"
          onUpdate={setProjectsProgress}
        />
      </div>

      <div className="tasks-section">
        <h2>Learning Tasks</h2>
        <TaskList tasks={tasks} onToggle={toggleTask} />
      </div>

      <div className="tips-section">
        <h2>Learning Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span>📚</span>
            <h3>Active Reading</h3>
            <p>Take notes while reading to improve retention</p>
          </div>
          <div className="tip-card">
            <span>⏰</span>
            <h3>Time Management</h3>
            <p>Set specific study times each day</p>
          </div>
          <div className="tip-card">
            <span>🎯</span>
            <h3>Goal Setting</h3>
            <p>Break down large goals into smaller tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EntertainmentProgress = () => {
  const [gamesProgress, setGamesProgress] = useState(0);
  const [moviesProgress, setMoviesProgress] = useState(0);
  const [hobbiesProgress, setHobbiesProgress] = useState(0);
  const [tasks, setTasks] = useState([
    { text: 'Play favorite game', completed: false },
    { text: 'Watch new movie', completed: false },
    { text: 'Practice hobby', completed: false },
    { text: 'Try something new', completed: false }
  ]);

  const toggleTask = (index) => {
    setTasks(tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>🎮 Entertainment Progress</h1>
        <p>Track your entertainment and hobbies</p>
      </div>

      <div className="progress-grid">
        <ProgressCard
          title="Games"
          value={gamesProgress}
          icon="🎮"
          description="Gaming progress and achievements"
          onUpdate={setGamesProgress}
        />
        <ProgressCard
          title="Movies & TV"
          value={moviesProgress}
          icon="🎬"
          description="Watch list progress"
          onUpdate={setMoviesProgress}
        />
        <ProgressCard
          title="Hobbies"
          value={hobbiesProgress}
          icon="🎨"
          description="Personal hobbies progress"
          onUpdate={setHobbiesProgress}
        />
      </div>

      <div className="tasks-section">
        <h2>Entertainment Goals</h2>
        <TaskList tasks={tasks} onToggle={toggleTask} />
      </div>

      <div className="tips-section">
        <h2>Entertainment Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span>⚖️</span>
            <h3>Balance</h3>
            <p>Balance entertainment with other activities</p>
          </div>
          <div className="tip-card">
            <span>🎯</span>
            <h3>New Experiences</h3>
            <p>Try different types of entertainment</p>
          </div>
          <div className="tip-card">
            <span>📝</span>
            <h3>Track Favorites</h3>
            <p>Keep a list of your favorite content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HealthProgress = () => {
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [nutritionProgress, setNutritionProgress] = useState(0);
  const [sleepProgress, setSleepProgress] = useState(0);
  const [tasks, setTasks] = useState([
    { text: '30 minutes exercise', completed: false },
    { text: 'Drink 8 glasses of water', completed: false },
    { text: '8 hours of sleep', completed: false },
    { text: 'Meditation session', completed: false }
  ]);

  const toggleTask = (index) => {
    setTasks(tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>❤️ Health Progress</h1>
        <p>Track your health and wellness journey</p>
      </div>

      <div className="progress-grid">
        <ProgressCard
          title="Exercise"
          value={exerciseProgress}
          icon="🏃‍♂️"
          description="Physical activity progress"
          onUpdate={setExerciseProgress}
        />
        <ProgressCard
          title="Nutrition"
          value={nutritionProgress}
          icon="🥗"
          description="Healthy eating progress"
          onUpdate={setNutritionProgress}
        />
        <ProgressCard
          title="Sleep"
          value={sleepProgress}
          icon="😴"
          description="Sleep quality tracking"
          onUpdate={setSleepProgress}
        />
      </div>

      <div className="tasks-section">
        <h2>Health Goals</h2>
        <TaskList tasks={tasks} onToggle={toggleTask} />
      </div>

      <div className="tips-section">
        <h2>Health Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span>🏃‍♂️</span>
            <h3>Daily Movement</h3>
            <p>Aim for 30 minutes of exercise daily</p>
          </div>
          <div className="tip-card">
            <span>🥗</span>
            <h3>Balanced Diet</h3>
            <p>Include a variety of nutrients in meals</p>
          </div>
          <div className="tip-card">
            <span>😴</span>
            <h3>Quality Sleep</h3>
            <p>Maintain a consistent sleep schedule</p>
          </div>
        </div>
      </div>
    </div>
  );
};
