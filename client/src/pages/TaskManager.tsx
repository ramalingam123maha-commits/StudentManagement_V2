import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, MessageSquare, Clock } from 'lucide-react';
import './Task.css';

export default function TaskManager() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: '',
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  const priorityColors: Record<string, string> = {
    urgent: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#10b981',
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Task Manager</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          New Task
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <h2>Create New Task</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              style={{ gridColumn: '1 / -1' }}
            ></textarea>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <button type="submit" className="btn btn-success">
              Create Task
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length > 0 ? (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-badges">
                    <span className="badge" style={{ backgroundColor: priorityColors[task.priority], color: 'white' }}>
                      {task.priority}
                    </span>
                    <span className={`badge badge-${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'info' : 'warning'}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="task-meta">
                  <span className="meta-item">
                    <Clock size={16} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  {task.comments && task.comments.length > 0 && (
                    <span className="meta-item">
                      <MessageSquare size={16} />
                      {task.comments.length} comments
                    </span>
                  )}
                </div>

                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No tasks found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
