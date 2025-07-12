import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS/components/AdminPanel.css";

const AdminPanel = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    totalVotes: 0
  });
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch stats
      const statsResponse = await fetch("http://localhost:5000/api/admin/stats", { headers });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch users
      const usersResponse = await fetch("http://localhost:5000/api/admin/users", { headers });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      // Fetch questions
      const questionsResponse = await fetch("http://localhost:5000/api/admin/questions", { headers });
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData.questions || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleQuestionAction = async (questionId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/questions/${questionId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You need admin privileges to access this page.</p>
            <Link to="/" className="back-button">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="loading">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage users, questions, and platform statistics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`tab-button ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="dashboard-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-number">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❓</div>
                <div className="stat-content">
                  <h3>Total Questions</h3>
                  <p className="stat-number">{stats.totalQuestions}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <h3>Total Answers</h3>
                  <p className="stat-number">{stats.totalAnswers}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👍</div>
                <div className="stat-content">
                  <h3>Total Votes</h3>
                  <p className="stat-number">{stats.totalVotes}</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">👤</span>
                  <span className="activity-text">New user registered</span>
                  <span className="activity-time">2 minutes ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">❓</span>
                  <span className="activity-text">New question posted</span>
                  <span className="activity-time">5 minutes ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">💬</span>
                  <span className="activity-text">New answer submitted</span>
                  <span className="activity-time">10 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="users-tab">
            <h2>User Management</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <Link to={`/profile/${user.username}`} className="user-link">
                          {user.username}
                        </Link>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          {user.role === "user" && (
                            <button
                              className="action-button promote"
                              onClick={() => handleUserAction(user._id, "promote")}
                            >
                              Promote
                            </button>
                          )}
                          {user.role === "admin" && user._id !== user._id && (
                            <button
                              className="action-button demote"
                              onClick={() => handleUserAction(user._id, "demote")}
                            >
                              Demote
                            </button>
                          )}
                          <button
                            className="action-button delete"
                            onClick={() => handleUserAction(user._id, "delete")}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="questions-tab">
            <h2>Question Management</h2>
            <div className="questions-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Votes</th>
                    <th>Answers</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question._id}>
                      <td>
                        <Link to={`/questions/${question._id}`} className="question-link">
                          {question.title}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/profile/${question.author?.username}`} className="user-link">
                          {question.author?.username || "Anonymous"}
                        </Link>
                      </td>
                      <td>{question.votes || 0}</td>
                      <td>{question.answers?.length || 0}</td>
                      <td>{formatDate(question.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-button delete"
                            onClick={() => handleQuestionAction(question._id, "delete")}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 