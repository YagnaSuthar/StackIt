import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../CSS/pages/HomePage.css';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const questionsPerPage = 5;

  // Dummy questions data
  const dummyQuestions = [
    {
      id: 1,
      title: "How to join 2 columns in a data set to make a separate column in SQL?",
      description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine both and make a full name column.",
      tags: ["sql", "database", "mysql"],
      username: "john_doe",
      answers: 5,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "React state not updating when using useState hook",
      description: "I'm trying to update state in my React component but the component doesn't re-render. I'm using the useState hook correctly but something seems to be wrong with my implementation.",
      tags: ["react", "javascript", "hooks"],
      username: "sarah_dev",
      answers: 3,
      timestamp: "4 hours ago"
    },
    {
      id: 3,
      title: "Python list comprehension vs for loop performance",
      description: "Which approach is more efficient for processing large datasets? I've heard list comprehensions are faster but I want to understand the actual performance difference and when to use each approach.",
      tags: ["python", "performance", "optimization"],
      username: "code_master",
      answers: 8,
      timestamp: "6 hours ago"
    },
    {
      id: 4,
      title: "CSS Grid vs Flexbox: When to use which?",
      description: "I'm confused about when to use CSS Grid and when to use Flexbox. Both seem to solve layout problems but I'm not sure about the best practices for each.",
      tags: ["css", "layout", "frontend"],
      username: "design_pro",
      answers: 12,
      timestamp: "8 hours ago"
    },
    {
      id: 5,
      title: "JavaScript async/await vs Promise.then()",
      description: "What are the differences between using async/await and Promise.then() for handling asynchronous operations? Which approach is more modern and why?",
      tags: ["javascript", "async", "promises"],
      username: "js_ninja",
      answers: 7,
      timestamp: "10 hours ago"
    },
    {
      id: 6,
      title: "Docker container networking best practices",
      description: "I'm setting up a multi-container application and need advice on networking between containers. What are the best practices for container communication?",
      tags: ["docker", "networking", "devops"],
      username: "devops_guru",
      answers: 4,
      timestamp: "12 hours ago"
    },
    {
      id: 7,
      title: "Machine Learning model validation techniques",
      description: "What are the most effective ways to validate machine learning models? I'm looking for techniques to ensure my model generalizes well to new data.",
      tags: ["machine-learning", "validation", "data-science"],
      username: "ml_researcher",
      answers: 9,
      timestamp: "14 hours ago"
    },
    {
      id: 8,
      title: "Node.js memory leaks: How to detect and fix them",
      description: "My Node.js application is consuming more memory over time. What are the common causes of memory leaks and how can I identify and fix them?",
      tags: ["nodejs", "memory-management", "debugging"],
      username: "backend_dev",
      answers: 6,
      timestamp: "16 hours ago"
    }
  ];

  const totalPages = Math.ceil(dummyQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = dummyQuestions.slice(startIndex, startIndex + questionsPerPage);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setQuestionsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuestionClick = (questionId) => {
    console.log(`Navigate to question ${questionId}`);
    // Add navigation logic here
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-number ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="homepage">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Latest Questions</h1>
            <p className="page-subtitle">Find answers to your programming questions</p>
          </header>

          <div className={`questions-container ${questionsLoaded ? 'loaded' : ''}`}>
            {currentQuestions.map((question, index) => (
              <article
                key={question.id}
                className="question-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleQuestionClick(question.id)}
              >
                <div className="question-content">
                  <h2 className="question-title">{question.title}</h2>
                  <p className="question-description">{question.description}</p>
                  
                  <div className="question-tags">
                    {question.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="question-meta">
                    <span className="username">{question.username}</span>
                    <span className="timestamp">{question.timestamp}</span>
                  </div>
                </div>
                
                <div className="question-stats">
                  <div className="answers-badge">
                    <span className="answers-count">{question.answers}</span>
                    <span className="answers-label">ans</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <nav className="pagination" aria-label="Questions pagination">
            <button
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            
            {renderPaginationNumbers()}
            
            <button
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
