const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

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

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO setup
// handleConnection(io);

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'StackIt API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});