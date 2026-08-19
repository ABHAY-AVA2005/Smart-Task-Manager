import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Search, Filter, Trash2, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, completed: 0, pending: 0, completionPercentage: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
  const [isEditing, setIsEditing] = useState(false);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${user.token}` }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, analyticsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tasks?search=${search}&status=${statusFilter}&priority=${priorityFilter}`, axiosConfig),
        axios.get('http://localhost:5000/api/tasks/analytics', axiosConfig)
      ]);
      setTasks(tasksRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, priorityFilter]);

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/tasks/${currentTask._id}`, currentTask, axiosConfig);
      } else {
        await axios.post('http://localhost:5000/api/tasks', currentTask, axiosConfig);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving task', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, axiosConfig);
        fetchData();
      } catch (error) {
        console.error('Error deleting task', error);
      }
    }
  };

  const handleMarkComplete = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { ...task, status: 'Done' }, axiosConfig);
      fetchData();
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  const openModalForNew = () => {
    setCurrentTask({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openModalForEdit = (task) => {
    setCurrentTask({ ...task, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' });
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <button className="btn btn-primary" onClick={openModalForNew}>
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>{analytics.total}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--success-color)' }}>{analytics.completed}</h3>
          <p>Completed</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--warning-color)' }}>{analytics.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 0.5rem' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="3"
                strokeDasharray={`${analytics.completionPercentage}, 100`}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {analytics.completionPercentage}%
            </div>
          </div>
          <p>Completion</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0 0.5rem' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.75rem', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <select className="form-input" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select className="form-input" style={{ width: 'auto' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Task List */}
      <div className="glass-panel">
        {loading ? (
          <p className="text-center">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center" style={{ padding: '2rem 0' }}>
            <p>No tasks found. Create one to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {tasks.map(task => (
              <div key={task._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', background: 'var(--surface-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ textDecoration: task.status === 'Done' ? 'line-through' : 'none', color: task.status === 'Done' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                    {task.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{task.description}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${task.status === 'Done' ? 'badge-done' : task.status === 'In Progress' ? 'badge-progress' : 'badge-todo'}`}>
                      {task.status}
                    </span>
                    <span className="badge" style={{ border: `1px solid ${task.priority === 'High' ? 'var(--danger-color)' : task.priority === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)'}`, color: task.priority === 'High' ? 'var(--danger-color)' : task.priority === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)' }}>
                      {task.priority} Priority
                    </span>
                    {task.dueDate && (
                      <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)' }}>
                        <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {task.status !== 'Done' && (
                    <button className="btn btn-outline" onClick={() => handleMarkComplete(task)} title="Mark Complete">
                      <CheckCircle size={16} color="var(--success-color)" />
                    </button>
                  )}
                  <button className="btn btn-outline" onClick={() => openModalForEdit(task)} title="Edit">
                    <Edit size={16} />
                  </button>
                  <button className="btn btn-outline" onClick={() => handleDelete(task._id)} title="Delete">
                    <Trash2 size={16} color="var(--danger-color)" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', background: 'var(--surface-color)' }}>
            <h3>{isEditing ? 'Edit Task' : 'Create Task'}</h3>
            <form onSubmit={handleSaveTask} className="mt-4">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={currentTask.title} onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={currentTask.description} onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={currentTask.status} onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})}>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={currentTask.priority} onChange={(e) => setCurrentTask({...currentTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-input" value={currentTask.dueDate} onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
