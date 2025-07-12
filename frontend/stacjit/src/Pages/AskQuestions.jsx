// src/Pages/AskQuestion.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import '../CSS/components/AskQuestions.css';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, tags });
    // TODO: Add API call to submit the question
  };

  const handleHome = () => {
    // TODO: Navigate to home page
    console.log('Navigate to home');
  };

  const handleProfile = () => {
    // TODO: Navigate to profile page
    console.log('Navigate to profile');
  };

  const handleNotifications = () => {
    // TODO: Handle notifications
    console.log('Show notifications');
  };

  return (
    <div className="ask-question-container">
    <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
    </div>

      {/* Screen Title */}
      <div className="screen-header">
        <h2 className="page-title">Ask Question</h2>
      </div>

      {/* Main Form */}
      <div className="form-container">
        <form className="ask-question-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter your question title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <div className="editor-container">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                className="quill-editor"
                placeholder="Describe your question in detail..."
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
                formats={[
                  'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                  'list', 'bullet', 'indent', 'link', 'image', 'code-block', 'script'
                ]}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              placeholder="Add comma-separated tags (e.g., javascript, react, css)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <div className="tags-help">
              <small>Use commas to separate tags. Max 5 tags allowed.</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;