import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/components/AskQuestion.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AskQuestion = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please login to ask a question");
      return;
    }

    if (!formData.title.trim() || !content.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tags = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: content.trim(), // <-- Use description
          tags: tags
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/questions/${data.question._id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create question");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="ask-question">
        <div className="container">
          <div className="login-required">
            <h2>Login Required</h2>
            <p>Please login to ask a question.</p>
            <button 
              className="login-button"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ask-question">
      <div className="container">
        <div className="ask-header">
          <h1>Ask a Question</h1>
          <p>Share your knowledge and help others learn</p>
        </div>

        <form onSubmit={handleSubmit} className="question-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="What's your question? Be specific."
              maxLength={300}
              required
            />
            <div className="form-help">
              Be specific and imagine you're asking another person
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              theme="snow"
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  ["blockquote", "code-block"],
                  [{ header: 1 }, { header: 2 }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
                "header", "bold", "italic", "underline", "strike", "blockquote",
                "list", "bullet", "indent", "link", "image", "code-block", "script"
              ]}
              placeholder="Describe your problem in detail..."
            />
            <div className="form-help">
              Include all the information someone would need to answer your question
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="javascript, react, nodejs (comma separated)"
            />
            <div className="form-help">
              Add up to 5 tags to describe what your question is about
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Question"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="form-tips">
          <h3>Writing a good question</h3>
          <ul>
            <li>Be specific about what you're asking</li>
            <li>Include relevant code snippets if applicable</li>
            <li>Describe what you've already tried</li>
            <li>Use clear, descriptive language</li>
            <li>Add appropriate tags to help others find your question</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion; 