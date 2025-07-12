// src/Pages/Register.jsx
import React, { useState, useEffect } from 'react';
import '../CSS/components/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Calculate password strength
  useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      return strength;
    };

    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

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

    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registering with:', formData);
      // TODO: Add actual API call here
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return '#ef4444';
    if (passwordStrength < 50) return '#f59e0b';
    if (passwordStrength < 75) return '#eab308';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="register-container">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Create Account</h2>
          <p>Join us and start your journey</p>
        </div>

        <div className="form-group">
          <label htmlFor="name">
            <span className="label-text">Full Name</span>
            <span className="label-icon">👤</span>
          </label>
          <input 
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter your full name"
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

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
              placeholder="Create a strong password"
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
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${passwordStrength}%`,
                    backgroundColor: getPasswordStrengthColor()
                  }}
                ></div>
              </div>
              <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                {getPasswordStrengthText()}
              </span>
            </div>
          )}
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <span className="label-text">Confirm Password</span>
            <span className="label-icon">🔐</span>
          </label>
          <div className="password-input-container">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              required 
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="register-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-content">
              <span className="spinner"></span>
              Creating Account...
            </span>
          ) : (
            <span className="button-content">
              <span className="button-text">Create Account</span>
              <span className="button-icon">🚀</span>
            </span>
          )}
        </button>

        <div className="form-footer">
          <p className="login-prompt">
            Already have an account? 
            <a href="/login" className="login-link">Sign in here</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;