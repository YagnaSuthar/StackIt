import React from "react";
import { Link } from "react-router-dom";
import "../CSS/components/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="home-button">
              Go Home
            </Link>
            <Link to="/questions" className="questions-button">
              Browse Questions
            </Link>
          </div>
          <div className="helpful-links">
            <h3>Popular Pages</h3>
            <div className="links-grid">
              <Link to="/questions" className="helpful-link">
                <span className="link-icon">❓</span>
                <span>All Questions</span>
              </Link>
              <Link to="/ask" className="helpful-link">
                <span className="link-icon">✍️</span>
                <span>Ask Question</span>
              </Link>
              <Link to="/login" className="helpful-link">
                <span className="link-icon">🔐</span>
                <span>Login</span>
              </Link>
              <Link to="/register" className="helpful-link">
                <span className="link-icon">📝</span>
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 