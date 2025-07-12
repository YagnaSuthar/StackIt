import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS/components/Homepage.css";

const HomePage = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Support both 'content' and 'description' fields for question text
  const getQuestionText = (q) => q.content || q.description || "";

  // Helper to get vote score safely
  const getVoteScore = (q) => {
    if (q.votes && q.votes.upvotes && q.votes.downvotes) {
      return q.votes.upvotes.length - q.votes.downvotes.length;
    }
    if (typeof q.votes === 'number') {
      return q.votes;
    }
    return 0;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="homepage">
        <div className="container">
          <div className="loading">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage">
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Welcome to StackIt</h1>
          <p className="hero-subtitle">
            Ask questions, share knowledge, and connect with developers worldwide
          </p>
          {user && (
            <Link to="/ask" className="cta-button">
              Ask a Question
            </Link>
          )}
        </div>

        {/* Questions Section */}
        <div className="questions-section">
          <div className="section-header">
            <h2>Recent Questions</h2>
            <Link to="/questions" className="view-all-link">
              View All Questions
            </Link>
          </div>

          {questions.length === 0 ? (
            <div className="empty-state">
              <p>No questions yet. Be the first to ask!</p>
              {user && (
                <Link to="/ask" className="cta-button">
                  Ask Your First Question
                </Link>
              )}
            </div>
          ) : (
            <div className="questions-grid">
              {questions.slice(0, 6).map((question) => (
                <div key={question._id || question.id} className="question-card">
                  <div className="question-stats">
                    <div className="stat">
                      <span className="stat-number">{getVoteScore(question)}</span>
                      <span className="stat-label">votes</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{question.answers?.length || 0}</span>
                      <span className="stat-label">answers</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{question.viewCount || question.views || 0}</span>
                      <span className="stat-label">views</span>
                    </div>
                  </div>
                  <div className="question-content">
                    <Link to={`/questions/${question._id || question.id}`} className="question-title">
                      {question.title || "Untitled"}
                    </Link>
                    <p className="question-excerpt">
                      {truncateText(getQuestionText(question))}
                    </p>
                    <div className="question-meta">
                      <div className="tags">
                        {question.tags?.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="question-author">
                        <span className="author-name">
                          {question.author?.username || "Anonymous"}
                        </span>
                        <span className="question-date">
                          {formatDate(question.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Why StackIt?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Ask Questions</h3>
              <p>Get help from the community with your technical questions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Share Knowledge</h3>
              <p>Help others by answering questions and sharing your expertise</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Build Reputation</h3>
              <p>Earn reputation points and badges for your contributions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
