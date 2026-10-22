import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import EnrollmentManagement from './pages/EnrollmentManagement';
import Reports from './pages/Reports';
import HotelManagement from './pages/HotelManagement';
import TaskManager from './pages/TaskManager';
import Login from './pages/Login';
import './App.css';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    // WebSocket listeners
    socket.on('student:enrolled', (data) => {
      setNotifications((prev) => [...prev, { type: 'success', message: `New enrollment: ${data.studentName}`, timestamp: new Date() }]);
    });

    socket.on('room:booked', (data) => {
      setNotifications((prev) => [...prev, { type: 'info', message: `New booking: ${data.bookingNumber}`, timestamp: new Date() }]);
    });

    socket.on('task:created', (data) => {
      setNotifications((prev) => [...prev, { type: 'info', message: `New task: ${data.title}`, timestamp: new Date() }]);
    });

    return () => {
      socket.off('student:enrolled');
      socket.off('room:booked');
      socket.off('task:created');
    };
  }, []);

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        {isAuthenticated ? (
          <Route element={<Layout user={user} onLogout={handleLogout} notifications={notifications} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/enrollments" element={<EnrollmentManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/hotel" element={<HotelManagement />} />
            <Route path="/tasks" element={<TaskManager />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
