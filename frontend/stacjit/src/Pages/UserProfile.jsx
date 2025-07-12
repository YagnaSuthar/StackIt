import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../CSS/components/UserProfile.css";

const UserProfile = () => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user profile
        const userRes = await fetch(`http://localhost:5000/api/users/${username}`);
        if (!userRes.ok) throw new Error("User not found");
        const userData = await userRes.json();
        setProfileUser(userData.user);

        // Fetch user's questions
        const questionsRes = await fetch(`http://localhost:5000/api/questions?author=${username}`);
        const questionsData = questionsRes.ok ? await questionsRes.json() : { questions: [] };
        setUserQuestions(questionsData.questions || []);

        // Fetch user's answers
        const answersRes = await fetch(`http://localhost:5000/api/answers/by-author/${username}`);
        const answersData = answersRes.ok ? await answersRes.json() : { answers: [] };
        setUserAnswers(answersData.answers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

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

  // Helper to get upvote count
  const getUpvoteCount = (item) => {
    if (item.votes && typeof item.votes === 'object' && item.votes.upvotes) {
      return item.votes.upvotes.length;
    }
    return 0;
  };

  // Helper to get downvote count
  const getDownvoteCount = (item) => {
    if (item.votes && typeof item.votes === 'object' && item.votes.downvotes) {
      return item.votes.downvotes.length;
    }
    return 0;
  };

  if (loading) {
    return <div className="user-profile"><div className="container"><div className="loading">Loading profile...</div></div></div>;
  }

  if (error) {
    return <div className="user-profile"><div className="container"><div className="error">Error: {error}</div></div></div>;
  }

  if (!profileUser) {
    return <div className="user-profile"><div className="container"><div className="error">User not found</div></div></div>;
  }

  return (
    <div className="user-profile">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {profileUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profileUser.username}</h1>
            <div className="profile-meta">
              <span className="profile-role">{profileUser.role}</span>
              <span className="profile-joined">Joined {formatDate(profileUser.createdAt)}</span>
            </div>
            {profileUser.bio && <p className="profile-bio">{profileUser.bio}</p>}
          </div>
          {profileUser && profileUser._id === profileUser._id && (
            <Link to="/profile/edit" className="edit-profile-button">
              Edit Profile
            </Link>
          )}
        </div>

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{userQuestions.length}</span>
            <span className="stat-label">Questions</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{userAnswers.length}</span>
            <span className="stat-label">Answers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{profileUser.reputation || 0}</span>
            <span className="stat-label">Reputation</span>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="profile-content">
          <div className="tab-navigation">
            <button className={`tab-button ${activeTab === "questions" ? "active" : ""}`} onClick={() => setActiveTab("questions")}>Questions ({userQuestions.length})</button>
            <button className={`tab-button ${activeTab === "answers" ? "active" : ""}`} onClick={() => setActiveTab("answers")}>Answers ({userAnswers.length})</button>
          </div>
          <div className="tab-content">
            {activeTab === "questions" && (
              <div className="questions-tab">
                {userQuestions.length === 0 ? (
                  <div className="empty-state">
                    <p>No questions yet.</p>
                  </div>
                ) : (
                  <div className="questions-list">
                    {userQuestions.map((question) => (
                      <div key={question._id} className="question-item">
                        <div className="question-stats">
                          <div className="stat">
                            <span className="stat-number">{getUpvoteCount(question)}</span>
                            <span className="stat-label">Upvotes</span>
                          </div>
                          <div className="stat">
                            <span className="stat-number">{getDownvoteCount(question)}</span>
                            <span className="stat-label">Downvotes</span>
                          </div>
                          <div className="stat">
                            <span className="stat-number">{question.answers?.length || 0}</span>
                            <span className="stat-label">answers</span>
                          </div>
                        </div>
                        <div className="question-content">
                          <Link to={`/questions/${question._id}`} className="question-title">{question.title}</Link>
                          <div className="question-text quill-content" dangerouslySetInnerHTML={{ __html: question.content || question.description || "" }} />
                          <div className="question-meta">
                            <div className="tags">
                              {question.tags?.slice(0, 3).map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                              ))}
                            </div>
                            <span className="question-date">{formatDate(question.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "answers" && (
              <div className="answers-tab">
                {userAnswers.length === 0 ? (
                  <div className="empty-state">
                    <p>No answers yet.</p>
                  </div>
                ) : (
                  <div className="answers-list">
                    {userAnswers.map((answer) => (
                      <div key={answer._id} className="answer-item">
                        <div className="answer-stats">
                          <div className="stat">
                            <span className="stat-number">{getUpvoteCount(answer)}</span>
                            <span className="stat-label">Upvotes</span>
                          </div>
                          <div className="stat">
                            <span className="stat-number">{getDownvoteCount(answer)}</span>
                            <span className="stat-label">Downvotes</span>
                          </div>
                        </div>
                        <div className="answer-content">
                          <Link to={`/questions/${answer.question?._id || answer.question}`} className="answer-question">{answer.questionTitle || "Question"}</Link>
                          <div className="answer-text quill-content" dangerouslySetInnerHTML={{ __html: answer.content || answer.description || answer.text || "No content available" }} />
                          <div className="answer-meta">
                            <span className="answer-date">{formatDate(answer.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 