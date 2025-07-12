import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../CSS/components/QuestionsList.css";

const QuestionsList = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState({
    sort: searchParams.get("sort") || "newest",
    tag: searchParams.get("tag") || "",
    search: searchParams.get("search") || ""
  });

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sort: filters.sort,
        ...(filters.tag && { tag: filters.tag }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`http://localhost:5000/api/questions?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data.questions || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    setSearchParams({ ...filters, [key]: value });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Helper to get vote score safely
  const getVoteScore = (q) => {
    if (q.votes && typeof q.votes === 'object' && q.votes.upvotes && q.votes.downvotes) {
      return q.votes.upvotes.length - q.votes.downvotes.length;
    }
    if (typeof q.votes === 'number') {
      return q.votes;
    }
    return 0;
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

  // Support both 'content' and 'description' fields for question text
  const getQuestionText = (q) => q.content || q.description || "";

  if (loading && questions.length === 0) {
    return (
      <div className="questions-list-page">
        <div className="container">
          <div className="loading">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="questions-list-page">
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="questions-list-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>All Questions</h1>
          {user && (
            <Link to="/ask" className="ask-button">
              Ask Question
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="votes">Most Voted</option>
              <option value="answers">Most Answered</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search questions..."
            />
          </div>

          <div className="filter-group">
            <label htmlFor="tag">Tag:</label>
            <input
              type="text"
              id="tag"
              value={filters.tag}
              onChange={(e) => handleFilterChange("tag", e.target.value)}
              placeholder="Filter by tag..."
            />
          </div>
        </div>

        {/* Questions Count */}
        <div className="questions-count">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
          {filters.search && ` matching "${filters.search}"`}
          {filters.tag && ` tagged "${filters.tag}"`}
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="empty-state">
            <p>No questions found.</p>
            {user && (
              <Link to="/ask" className="cta-button">
                Ask the First Question
              </Link>
            )}
          </div>
        ) : (
          <div className="questions-grid">
            {questions.map((question) => (
              <div key={question._id} className="question-card">
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
                  <div className="stat">
                    <span className="stat-number">{question.views || 0}</span>
                    <span className="stat-label">views</span>
                  </div>
                </div>
                <div className="question-content">
                  <Link to={`/questions/${question._id}`} className="question-title">
                    {question.title}
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
                      {question.author?.username ? (
                        <Link to={`/profile/${question.author.username}`} className="author-name">
                          {question.author.username}
                        </Link>
                      ) : (
                        <span className="author-name">Anonymous</span>
                      )}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsList; 