import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import './Management.css';

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/enrollments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Enrollment Management</h1>
        <button className="btn btn-primary">
          <Plus size={20} />
          New Enrollment
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading enrollments...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Grade</th>
                  <th>Score</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td>{enrollment.student?.firstName} {enrollment.student?.lastName}</td>
                      <td>{enrollment.course?.courseName}</td>
                      <td>
                        <span className={`badge badge-${enrollment.status === 'enrolled' ? 'info' : enrollment.status === 'completed' ? 'success' : 'warning'}`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td>{enrollment.grade}</td>
                      <td>{enrollment.score}</td>
                      <td>{enrollment.attendance}%</td>
                      <td>
                        <button className="btn btn-sm btn-danger">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                      No enrollments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
