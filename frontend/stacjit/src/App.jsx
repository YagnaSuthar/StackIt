// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import QuestionDetail from "./Pages/QuestionDetail";
import AskQuestion from "./Pages/AskQuestion";
import UserProfile from "./Pages/UserProfile";
import QuestionsList from "./Pages/QuestionsList";
import AdminPanel from "./Pages/AdminPanel";
import Notifications from "./Pages/Notifications";
import NotFound from "./Pages/NotFound";
import "./CSS/components/Homepage.css";

function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          fetchNotifications(token);
        } else {
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setNotifications([]);
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px",
        color: "#586069"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar 
          user={user} 
          notifications={notifications} 
          onLogout={handleLogout} 
        />
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/questions" element={<QuestionsList user={user} />} />
          <Route path="/questions/:id" element={<QuestionDetail user={user} />} />
          <Route path="/ask" element={<AskQuestion user={user} />} />
          <Route path="/profile/:username" element={<UserProfile user={user} />} />
          <Route path="/admin" element={<AdminPanel user={user} />} />
          <Route path="/notifications" element={<Notifications user={user} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
