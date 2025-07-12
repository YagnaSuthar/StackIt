// src/Pages/HomePage.jsx
import React from 'react';
import '../CSS/components/Homepage.css';

const HomePage = () => {
  const questions = [
    {
      id: 1,
      title: "How do I integrate React with Django backend?",
      user: "user123",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "What's the difference between useEffect and useLayoutEffect?",
      user: "dev_girl",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "How to optimize SQL queries in PostgreSQL?",
      user: "data_ninja",
      time: "1 day ago",
    },
  ];

  return (
    <div className="homepage">
      <div className="hero-section">
        <h2>Welcome to <span className="highlight">StackIt</span></h2>
        <p>Ask. Answer. Share. Empower the developer community.</p>
      </div>

      <div className="question-feed">
        <h3>📌 Latest Questions</h3>
        <div className="question-list">
          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <h4 className="question-title">{q.title}</h4>
              <div className="question-meta">
                <span>🧑 {q.user}</span>
                <span>🕒 {q.time}</span>
              </div>
              <button className="view-btn">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
