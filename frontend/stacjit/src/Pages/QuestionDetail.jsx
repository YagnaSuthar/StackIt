import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../CSS/components/QuestionDetail.css";

const QuestionDetail = ({ user }) => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }
      const data = await response.json();
      setQuestion(data.question);
      setAnswers(data.answers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type, itemId, itemType) => {
    if (!user) {
      alert("Please login to vote");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${itemType}/${itemId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ voteType: type }),
      });

      if (response.ok) {
        fetchQuestionAndAnswers(); // Refresh data
      }
    } catch (error) {
      console.error("Vote failed:", error);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to answer");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: newAnswer }),
      });

      if (response.ok) {
        setNewAnswer("");
        setShowAnswerForm(false);
        fetchQuestionAndAnswers(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="question-detail">
        <div className="container">
          <div className="loading">Loading question...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="question-detail">
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="question-detail">
        <div className="container">
          <div className="error">Question not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="question-detail">
      <div className="container">
        {/* Question Header */}
        <div className="question-header">
          <h1 className="question-title">{question.title}</h1>
          <div className="question-meta">
            <span className="question-date">
              Asked {formatDate(question.createdAt)}
            </span>
            <span className="question-author">
              by {question.author?.username || "Anonymous"}
            </span>
          </div>
        </div>

        {/* Question Content */}
        <div className="question-content">
          <div className="vote-section">
            <button
              className="vote-button upvote"
              onClick={() => handleVote("up", question._id, "questions")}
            >
              ▲
            </button>
            <span className="vote-count">{question.votes || 0}</span>
            <button
              className="vote-button downvote"
              onClick={() => handleVote("down", question._id, "questions")}
            >
              ▼
            </button>
          </div>
          <div className="content-section">
            <div className="question-text">{question.content}</div>
            <div className="question-tags">
              {question.tags?.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="answers-section">
          <h2 className="answers-title">
            {answers.length} Answer{answers.length !== 1 ? "s" : ""}
          </h2>

          {answers.map((answer) => (
            <div key={answer._id} className="answer-item">
              <div className="vote-section">
                <button
                  className="vote-button upvote"
                  onClick={() => handleVote("up", answer._id, "answers")}
                >
                  ▲
                </button>
                <span className="vote-count">{answer.votes || 0}</span>
                <button
                  className="vote-button downvote"
                  onClick={() => handleVote("down", answer._id, "answers")}
                >
                  ▼
                </button>
              </div>
              <div className="content-section">
                <div className="answer-text">{answer.content}</div>
                <div className="answer-meta">
                  <span className="answer-author">
                    {answer.author?.username || "Anonymous"}
                  </span>
                  <span className="answer-date">
                    {formatDate(answer.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Answer Form */}
          {user ? (
            <div className="answer-form-section">
              {!showAnswerForm ? (
                <button
                  className="answer-button"
                  onClick={() => setShowAnswerForm(true)}
                >
                  Write an Answer
                </button>
              ) : (
                <form onSubmit={handleSubmitAnswer} className="answer-form">
                  <h3>Your Answer</h3>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer here..."
                    rows={8}
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="submit-button">
                      Post Answer
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setShowAnswerForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="login-prompt">
              <p>Please <Link to="/login">login</Link> to answer this question.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail; 