const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Helper function to get headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Get current user
  getMe: async () => {
    return await apiRequest('/auth/me');
  },

  // Logout user
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  }
};

// Questions API functions
export const questionsAPI = {
  // Get all questions
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/questions${queryString ? `?${queryString}` : ''}`);
  },

  // Get single question
  getById: async (id) => {
    return await apiRequest(`/questions/${id}`);
  },

  // Create question
  create: async (questionData) => {
    return await apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
  },

  // Update question
  update: async (id, questionData) => {
    return await apiRequest(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData)
    });
  },

  // Delete question
  delete: async (id) => {
    return await apiRequest(`/questions/${id}`, {
      method: 'DELETE'
    });
  },

  // Vote on question
  vote: async (id, voteType) => {
    return await apiRequest(`/questions/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ type: voteType })
    });
  }
};

// Answers API functions
export const answersAPI = {
  // Create answer for a question
  create: async (questionId, answerData) => {
    return await apiRequest(`/questions/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(answerData)
    });
  },

  // Update answer
  update: async (id, answerData) => {
    return await apiRequest(`/answers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(answerData)
    });
  },

  // Delete answer
  delete: async (id) => {
    return await apiRequest(`/answers/${id}`, {
      method: 'DELETE'
    });
  },

  // Vote on answer
  vote: async (id, voteType) => {
    return await apiRequest(`/answers/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ type: voteType })
    });
  },

  // Accept answer
  accept: async (id) => {
    return await apiRequest(`/answers/${id}/accept`, {
      method: 'POST'
    });
  }
};

// Notifications API functions
export const notificationsAPI = {
  // Get all notifications
  getAll: async () => {
    return await apiRequest('/notifications');
  },

  // Mark notification as read
  markAsRead: async (id) => {
    return await apiRequest(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await apiRequest('/notifications/read-all', {
      method: 'PUT'
    });
  }
};

// Health check
export const healthCheck = async () => {
  return await apiRequest('/health');
};

export default {
  auth: authAPI,
  questions: questionsAPI,
  answers: answersAPI,
  notifications: notificationsAPI,
  healthCheck
}; 