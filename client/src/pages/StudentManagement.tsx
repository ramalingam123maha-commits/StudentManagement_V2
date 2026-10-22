import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import './Management.css';

export default function StudentManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    department: 'Engineering',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/students', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
      setShowForm(false);
      setFormData({
        registrationNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        department: 'Engineering',
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to register student');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    } catch (error) {
      alert('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          New Student
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <h2>Register New Student</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="text"
              placeholder="Registration Number"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            >
              <option value="Engineering">Engineering</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
              <option value="Business">Business</option>
            </select>
            <button type="submit" className="btn btn-success">
              Register Student
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Registration Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>GPA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td><strong>{student.registrationNumber}</strong></td>
                    <td>{`${student.firstName} ${student.lastName}`}</td>
                    <td>{student.email}</td>
                    <td>{student.department}</td>
                    <td>
                      <span className={`badge badge-${student.status === 'active' ? 'success' : 'warning'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>{student.gpa.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(student._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
