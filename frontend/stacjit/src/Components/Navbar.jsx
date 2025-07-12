import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/components/Navbar.css";
// Placeholder for notification icon (replace with SVG or icon library as needed)
const BellIcon = ({ hasUnread }) => (
  <span className={`notification-bell${hasUnread ? " unread" : ""}`}>🔔</span>
);

const Navbar = ({ user, notifications, onLogout }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (notifications && notifications.some((n) => !n.read)) {
      setHasUnread(true);
    } else {
      setHasUnread(false);
    }
  }, [notifications]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          StackIt
        </Link>
        <div className="navbar-links">
          <Link to="/questions" className="navbar-link">
            Questions
          </Link>
          {user && (
            <Link to="/ask" className="navbar-link">
              Ask Question
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link to="/admin" className="navbar-link">
              Admin
            </Link>
          )}
        </div>
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/notifications" className="navbar-icon">
                <BellIcon hasUnread={hasUnread} />
                {hasUnread && (
                  <span className="notification-badge">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </Link>
              <div className="navbar-user" onClick={() => setShowMenu((v) => !v)}>
                <span className="navbar-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="navbar-username">{user.username}</span>
                <div className={`navbar-dropdown${showMenu ? " show" : ""}`}>
                  <Link to={`/profile/${user.username}`} className="dropdown-item">
                    Profile
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
