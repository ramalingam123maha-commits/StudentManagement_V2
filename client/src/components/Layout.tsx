import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, Home, Users, BookOpen, BarChart3, Hotel, CheckSquare } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  user: any;
  onLogout: () => void;
  notifications: any[];
}

export default function Layout({ user, onLogout, notifications }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/enrollments', label: 'Enrollments', icon: BookOpen },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/hotel', label: 'Hotel', icon: Hotel },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  ];

  const unreadNotifications = notifications.length;

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="logo">SMS</h1>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="nav-item"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Header */}
      <header className="header">
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        <h2 className="page-title">Student Management System</h2>

        <div className="header-actions">
          <div className="notifications">
            <button className="notification-btn">
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>
          </div>

          <div className="user-menu">
            <span className="user-name">{user?.fullName || user?.username}</span>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
