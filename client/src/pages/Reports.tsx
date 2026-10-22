import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import './Reports.css';

export default function Reports() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/reports/enrollment/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Academic Reports & Analytics</h1>
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : stats ? (
        <div className="reports-grid">
          <div className="report-card">
            <div className="report-icon">
              <BarChart3 size={32} />
            </div>
            <div className="report-content">
              <div className="report-value">{stats.totalEnrollments}</div>
              <div className="report-label">Total Enrollments</div>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon">
              <Users size={32} />
            </div>
            <div className="report-content">
              <div className="report-value">{stats.byStatus?.enrolled || 0}</div>
              <div className="report-label">Active Enrollments</div>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon">
              <TrendingUp size={32} />
            </div>
            <div className="report-content">
              <div className="report-value">{stats.averageScore}</div>
              <div className="report-label">Average Score</div>
            </div>
          </div>

          <div className="card">
            <h2>Enrollment Status Breakdown</h2>
            <div className="breakdown">
              <div className="breakdown-item">
                <span>Enrolled</span>
                <span className="badge badge-info">{stats.byStatus?.enrolled || 0}</span>
              </div>
              <div className="breakdown-item">
                <span>Completed</span>
                <span className="badge badge-success">{stats.byStatus?.completed || 0}</span>
              </div>
              <div className="breakdown-item">
                <span>Dropped</span>
                <span className="badge badge-danger">{stats.byStatus?.dropped || 0}</span>
              </div>
              <div className="breakdown-item">
                <span>Pending</span>
                <span className="badge badge-warning">{stats.byStatus?.pending || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Attendance & Performance</h2>
            <div className="metrics">
              <div className="metric">
                <span>Average Attendance</span>
                <span className="metric-value">{stats.averageAttendance}%</span>
              </div>
              <div className="metric">
                <span>Average Score</span>
                <span className="metric-value">{stats.averageScore}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}
