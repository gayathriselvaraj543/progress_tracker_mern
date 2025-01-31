import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import {
  HomeProgress,
  KnowledgeProgress,
  EntertainmentProgress,
  HealthProgress
} from './components/Progress/ProgressPages';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const PrivateLayout = ({ children }) => (
  <PrivateRoute>
    <div className="flex">
      <Sidebar />
      <div className="ml-[250px] flex-1 p-6">
        {children}
      </div>
    </div>
  </PrivateRoute>
);

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
          
          <Route path="/progress">
            <Route path="home" element={<PrivateLayout><HomeProgress /></PrivateLayout>} />
            <Route path="knowledge" element={<PrivateLayout><KnowledgeProgress /></PrivateLayout>} />
            <Route path="entertainment" element={<PrivateLayout><EntertainmentProgress /></PrivateLayout>} />
            <Route path="health" element={<PrivateLayout><HealthProgress /></PrivateLayout>} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
