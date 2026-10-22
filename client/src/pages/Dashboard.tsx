import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, BookOpen, BarChart3, TrendingUp } from 'lucide-react';
import './Dashboard.css';

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [students, enrollments, reports] = await Promise.all([
        axios.get('http://localhost:5000/api/students', { headers }),
        axios.get('http://localhost:5000/api/enrollments', { headers }),
        axios.get('http://localhost:5000/api/reports/enrollment/stats', { headers }),
      ]).catch(() => [{ data: { data: [] } }, { data: { data: [] } }, { data: { data: {} } }]);

      setStats({
        totalStudents: students.data?.data?.length || 0,
        totalEnrollments: enrollments.data?.data?.length || 0,
        averageGPA: (enrollments.data?.data || []).reduce((sum: number, e: any) => sum + (e.gpa || 0), 0) / (enrollments.data?.data?.length || 1) || 0,
        activeEnrollments: reports.data?.data?.byStatus?.enrolled || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    {
      label: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: <Users size={32} />,
      color: '#2563eb',
    },
    {
      label: 'Total Enrollments',
      value: stats?.totalEnrollments || 0,
      icon: <BookOpen size={32} />,
      color: '#059669',
    },
    {
      label: 'Average GPA',
      value: stats?.averageGPA || 0,
      icon: <BarChart3 size={32} />,
      color: '#f59e0b',
    },
    {
      label: 'Active Enrollments',
      value: stats?.activeEnrollments || 0,
      icon: <TrendingUp size={32} />,
      color: '#8b5cf6',
    },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-heading">Dashboard</h1>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map((card, index) => (
              <div key={index} className="stat-card" style={{ borderLeftColor: card.color }}>
                <div className="stat-icon" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className="stat-content">
                  <div className="stat-value">{card.value}</div>
                  <div className="stat-label">{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">System Overview</h2>
              </div>
              <div className="card-body">
                <div className="feature-list">
                  <h3>Student Management Dashboard</h3>
                  <ul>
                    <li>✓ Register and manage students</li>
                    <li>✓ Track academic progress</li>
                    <li>✓ Manage course enrollments</li>
                    <li>✓ Generate performance reports</li>
                    <li>✓ Real-time notifications</li>
                  </ul>
                </div>

                <div className="feature-list">
                  <h3>Hotel Management System</h3>
                  <ul>
                    <li>✓ Room booking management</li>
                    <li>✓ Guest check-ins/check-outs</li>
                    <li>✓ Reservation management</li>
                    <li>✓ Billing and payment tracking</li>
                    <li>✓ Real-time WebSocket updates</li>
                  </ul>
                </div>

                <div className="feature-list">
                  <h3>Task Manager Application</h3>
                  <ul>
                    <li>✓ Create and assign tasks</li>
                    <li>✓ Priority levels and deadlines</li>
                    <li>✓ Status tracking</li>
                    <li>✓ Collaborative comments</li>
                    <li>✓ Real-time notifications</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
              </div>
              <div className="quick-actions">
                <a href="/students" className="action-btn">New Student Registration</a>
                <a href="/enrollments" className="action-btn">Manage Enrollments</a>
                <a href="/reports" className="action-btn">View Reports</a>
                <a href="/hotel" className="action-btn">Hotel Management</a>
                <a href="/tasks" className="action-btn">Create Task</a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
