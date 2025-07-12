// src/Pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../CSS/components/Login.css';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 1) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setLoginError('');
    
    try {
      const response = await authAPI.login(formData);
      console.log('Login successful:', response);
      setUser(response.user); // <-- Add this line!
      localStorage.setItem('token', response.token); // Save token for future requests
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your StackIt account</p>
        </div>

        {loginError && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            {loginError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">
            <span className="label-text">Email Address</span>
            <span className="label-icon">✉️</span>
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter your email"
            required 
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <span className="label-text">Password</span>
            <span className="label-icon">🔒</span>
          </label>
          <div className="password-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              required 
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input 
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-text">Remember me</span>
          </label>
          <a href="#" className="forgot-link">
            Forgot Password?
            <span className="forgot-icon">🔑</span>
          </a>
        </div>

        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-content">
              <span className="spinner"></span>
              Signing in...
            </span>
          ) : (
            <span className="button-content">
              <span className="button-text">Sign In</span>
              <span className="button-icon">🚀</span>
            </span>
          )}
        </button>

        <div className="divider">
          <span className="divider-text">OR</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn google-btn">
            <span className="social-icon">🔍</span>
            Continue with Google
          </button>
          <button type="button" className="social-btn github-btn">
            <span className="social-icon">💻</span>
            Continue with GitHub
          </button>
        </div>

        <div className="form-footer">
          <p className="register-prompt">
            Don't have an account? 
            <a href="/register" className="register-link">Create one now</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;