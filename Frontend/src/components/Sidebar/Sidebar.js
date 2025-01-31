import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <Link to="/" className="sidebar-item">
          <span>📊 Dashboard</span>
        </Link>
        <Link to="/progress/home" className="sidebar-item">
          <span>🏠 Home Progress</span>
        </Link>
        <Link to="/progress/knowledge" className="sidebar-item">
          <span>📚 Knowledge Progress</span>
        </Link>
        <Link to="/progress/entertainment" className="sidebar-item">
          <span>🎮 Entertainment Progress</span>
        </Link>
        <Link to="/progress/health" className="sidebar-item">
          <span>❤️ Health Progress</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
