import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../CSS/components/UserProfile.css";

const UserProfile = ({ user }) => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${username}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setProfileUser(data.user);
      
      // Fetch user's questions and answers
      const questionsResponse = await fetch(`http://localhost:5000/api/questions?author=${username}`);
      const answersResponse = await fetch(`http://localhost:5000/api/answers?author=${username}`);
      
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setUserQuestions(questionsData.questions || []);
      }
      
      if (answersResponse.ok) {
        const answersData = await answersResponse.json();
        setUserAnswers(answersData.answers || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="user-profile">
        <div className="container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile">
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="user-profile">
        <div className="container">
          <div className="error">User not found</div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // Debugging: log the user and profileUser objects
  console.log('profileUser:', profileUser);
  console.log('user:', user);

  // Use _id or id for comparison
  const profileUserId = profileUser._id || profileUser.id;
  const loggedInUserId = user?._id || user?.id;

=======
>>>>>>> e8819b250816261753ea86383cbcd8be1ef425ea
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
              <span className="profile-joined">
                Joined {formatDate(profileUser.createdAt)}
              </span>
            </div>
            {profileUser.bio && (
              <p className="profile-bio">{profileUser.bio}</p>
            )}
          </div>
<<<<<<< HEAD
          {loggedInUserId && profileUserId && loggedInUserId === profileUserId && (
=======
          {user && user._id === profileUser._id && (
>>>>>>> e8819b250816261753ea86383cbcd8be1ef425ea
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
            <button
              className={`tab-button ${activeTab === "questions" ? "active" : ""}`}
              onClick={() => setActiveTab("questions")}
            >
              Questions ({userQuestions.length})
            </button>
            <button
              className={`tab-button ${activeTab === "answers" ? "active" : ""}`}
              onClick={() => setActiveTab("answers")}
            >
              Answers ({userAnswers.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "questions" && (
              <div className="questions-tab">
                {userQuestions.length === 0 ? (
                  <div className="empty-state">
                    <p>No questions yet.</p>
                    <Link to="/ask" className="cta-button">
                      Ask Your First Question
                    </Link>
                  </div>
                ) : (
                  <div className="questions-list">
                    {userQuestions.map((question) => (
                      <div key={question._id} className="question-item">
                        <div className="question-stats">
                          <div className="stat">
                            <span className="stat-number">{question.votes || 0}</span>
                            <span className="stat-label">votes</span>
                          </div>
                          <div className="stat">
                            <span className="stat-number">{question.answers?.length || 0}</span>
                            <span className="stat-label">answers</span>
                          </div>
                        </div>
                        <div className="question-content">
                          <Link to={`/questions/${question._id}`} className="question-title">
                            {question.title}
                          </Link>
                          <p className="question-excerpt">
                            {truncateText(question.content)}
                          </p>
                          <div className="question-meta">
                            <div className="tags">
                              {question.tags?.slice(0, 3).map((tag, index) => (
                                <span key={index} className="tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="question-date">
                              {formatDate(question.createdAt)}
                            </span>
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
                    <p>Start answering questions to build your reputation!</p>
                  </div>
                ) : (
                  <div className="answers-list">
                    {userAnswers.map((answer) => (
                      <div key={answer._id} className="answer-item">
                        <div className="answer-stats">
                          <div className="stat">
                            <span className="stat-number">{answer.votes || 0}</span>
                            <span className="stat-label">votes</span>
                          </div>
                        </div>
                        <div className="answer-content">
                          <Link to={`/questions/${answer.question}`} className="answer-question">
                            {answer.questionTitle || "Question"}
                          </Link>
                          <p className="answer-excerpt">
                            {truncateText(answer.content)}
                          </p>
                          <div className="answer-meta">
                            <span className="answer-date">
                              {formatDate(answer.createdAt)}
                            </span>
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