const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
};

const handleConnection = (io) => {
  io.use(socketAuth);
  
  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected`);
    
    // Join user to their personal room for notifications
    socket.join(`user:${socket.user.id}`);
    
    // Handle new question event
    socket.on('new-question', (questionData) => {
      // Broadcast to all users except sender
      socket.broadcast.emit('question-created', questionData);
    });
    
    // Handle new answer event
    socket.on('new-answer', (answerData) => {
      // Emit to question author
      socket.to(`user:${answerData.questionAuthor}`).emit('answer-received', answerData);
    });
    
    // Handle notification events
    socket.on('notification', (notificationData) => {
      socket.to(`user:${notificationData.recipient}`).emit('new-notification', notificationData);
    });
    
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`);
    });
  });
};

module.exports = { handleConnection };