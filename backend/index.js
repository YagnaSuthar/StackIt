const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

// Set default environment variables for development
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev-secret-key-change-in-production';
}
if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = '30d';
}

const errorHandler = require('./middlewares/errorHandler');
// const { handleConnection } = require('./utils/socketHandler');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 
      'https://your-frontend-domain.com' : 
      'http://localhost:3000',
    credentials: true
  }
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    'https://your-frontend-domain.com' : 
    'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection (removed deprecated options)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stackit';
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO setup
// handleConnection(io);

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'StackIt API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is working!' 
  });
});

// Load routes one by one to identify the problematic one
console.log('Loading auth routes...');
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

console.log('Loading question routes...');
try {
  const questionRoutes = require('./routes/questionRoutes');
  app.use('/api/questions', questionRoutes);
  console.log('Question routes loaded successfully');
} catch (error) {
  console.error('Error loading question routes:', error.message);
}

console.log('Loading answer routes...');
try {
  const answerRoutes = require('./routes/answerRoutes');
  app.use('/api', answerRoutes);
  console.log('Answer routes loaded successfully');
} catch (error) {
  console.error('Error loading answer routes:', error.message);
}

console.log('Loading notification routes...');
try {
  const notificationRoutes = require('./routes/notificationRoutes');
  app.use('/api/notifications', notificationRoutes);
  console.log('Notification routes loaded successfully');
} catch (error) {
  console.error('Error loading notification routes:', error.message);
}

// Routes documentation endpoint
app.get('/api/routes', (req, res) => {
  res.json({
    success: true,
    routes: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user (protected)'
      },
      questions: {
        'GET /api/questions': 'Get all questions',
        'POST /api/questions': 'Create new question (protected)',
        'GET /api/questions/:id': 'Get single question',
        'PUT /api/questions/:id': 'Update question (protected)',
        'DELETE /api/questions/:id': 'Delete question (protected)',
        'POST /api/questions/:id/vote': 'Vote on question (protected)'
      },
      answers: {
        'POST /api/questions/:questionId/answers': 'Create answer (protected)',
        'PUT /api/answers/:id': 'Update answer (protected)',
        'DELETE /api/answers/:id': 'Delete answer (protected)',
        'POST /api/answers/:id/vote': 'Vote on answer (protected)',
        'POST /api/answers/:id/accept': 'Accept answer (protected)'
      },
      notifications: {
        'GET /api/notifications': 'Get user notifications (protected)',
        'PUT /api/notifications/:id/read': 'Mark notification as read (protected)',
        'PUT /api/notifications/read-all': 'Mark all notifications as read (protected)'
      },
      system: {
        'GET /api/health': 'Health check',
        'GET /api/routes': 'API documentation',
        'GET /test': 'Simple test endpoint'
      }
    }
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method,
    availableRoutes: '/api/routes'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API documentation: http://localhost:${PORT}/api/routes`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});