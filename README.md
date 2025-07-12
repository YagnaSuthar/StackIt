Problem Statement - StackIt – A Minimal Q&A Forum Platform

Team Members -
Sutariya Neel K. (Leader)      - neelsutariya21@gmail.com
Suthar Yagna Kalpeshbhai       - yagna.suthar@gmail.com
Kharadi Dhrumil Jagadishkumar  - dhumil05@gmail.com
Kavya SatishKumar Joshi        - kavyajoshi4290@gmail.com

# StackIt - Q&A Platform

A full-stack question and answer platform built with Node.js, Express, MongoDB, and React. StackIt provides a community-driven platform where users can ask questions, provide answers, vote on content, and engage with other users through a modern web interface.

## 📋 Project Brief

StackIt is a comprehensive Q&A platform inspired by Stack Overflow, designed to facilitate knowledge sharing and community engagement. The platform features a robust voting system, real-time notifications, user reputation tracking, and a modern responsive interface.

### Key Features:
- **Community-Driven Q&A**: Users can ask questions, provide answers, and vote on content
- **Advanced Voting System**: Separate upvote/downvote tracking with reputation impact
- **Real-time Notifications**: Instant alerts for new answers, votes, and mentions
- **User Profiles**: Comprehensive user profiles with activity history and reputation
- **Rich Text Editor**: Advanced content creation with React Quill
- **Responsive Design**: Modern UI that works across all devices
- **Admin Panel**: Content moderation and user management tools

### Target Users:
- Developers seeking technical help
- Students looking for educational resources
- Professionals sharing industry knowledge
- Anyone wanting to build a knowledge-sharing community

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - User registration and login with JWT tokens
  - Protected routes and middleware
  - User profiles with reputation system

- **Question Management**
  - Create, edit, and delete questions
  - Rich text editor for question content
  - Question categorization and tagging
  - Search and filter questions

- **Answer System**
  - Post answers to questions
  - Edit and delete answers
  - Accept best answers
  - Answer voting system

- **Voting System**
  - Upvote and downvote questions and answers
  - Separate tracking of upvotes and downvotes
  - Vote-based reputation system

- **User Profiles**
  - View user profiles with activity history
  - Track questions and answers by user
  - User reputation and statistics

- **Real-time Notifications**
  - Get notified for new answers, votes, and mentions
  - Mark notifications as read
  - Real-time updates using Socket.IO

- **Admin Panel**
  - User management
  - Content moderation
  - Platform statistics

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Real-time**: Socket.IO
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Rich Text Editor**: React Quill
- **Icons**: Lucide React
- **Styling**: CSS3 with custom components

### Database
- **Primary Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Collections**: Users, Questions, Answers, Notifications

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## 🚀 Installation & Setup

### Prerequisites
Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB Atlas account** - [Sign up here](https://www.mongodb.com/atlas)
- **Git** (for cloning the repository)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd StackIt
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/stackit?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Server Configuration
NODE_ENV=development
PORT=5000

# Optional: Socket.IO Configuration
SOCKET_CORS_ORIGIN=http://localhost:5173
```

#### Start Backend Server
```bash

node index.js
npm start
```

**Backend will be available at:** `http://localhost:5000`

**API Health Check:** `http://localhost:5000/api/health`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend/stacjit
npm install
```

#### Configure API Endpoint (Optional)
If your backend runs on a different port, update the API base URL in:
- `src/services/api.js` (if using a centralized API service)
- Or update individual fetch calls in components

#### Start Frontend Development Server
```bash
# Development mode
npm run dev


**Frontend will be available at:** `http://localhost:5173`

### 4. Running Both Servers

#### Option 1: Separate Terminals
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend/stacjit
npm run dev
```

Create a script in the root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend/stacjit && npm run dev\"",
    "install-all": "cd backend && npm install && cd ../frontend/stacjit && npm install"
  }
}
```

Then run both servers with one command:
```bash
npm run dev
```

### 5. Verify Installation

1. **Backend Check:**
   - Visit `http://localhost:5000/api/health`
   - Should return: `{"success":true,"message":"StackIt API is running"}`

2. **Frontend Check:**
   - Visit `http://localhost:5173`
   - Should show the StackIt homepage

3. **Database Check:**
   - Check backend console for: `MongoDB connected successfully`
   - If connection fails, verify your MongoDB Atlas connection string

### 6. First Time Setup

1. **Register a new account** at `http://localhost:5173/register`
2. **Login** with your credentials
3. **Ask your first question** to test the platform
4. **Explore the features** - voting, answering, notifications

### Troubleshooting Common Setup Issues

#### Backend Issues:
```bash
# Port 5000 already in use
netstat -ano | findstr :5000
# Kill the process or change PORT in .env

# MongoDB connection failed
# Check your connection string and network connectivity
# Ensure IP is whitelisted in MongoDB Atlas

# Module not found errors
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### Frontend Issues:
```bash
# Port 5173 already in use
# Vite will automatically use the next available port

# Module not found errors
cd frontend/stacjit
rm -rf node_modules package-lock.json
npm install

# API connection issues
# Check if backend is running on port 5000
# Verify CORS settings in backend
```

## 📖 Usage Guide

### Getting Started
1. **Open your browser** and navigate to `http://localhost:5173`
2. **Register a new account** or login with existing credentials
3. **Start asking questions** or answering existing ones
4. **Vote on questions and answers** to help the community
5. **Build your reputation** by providing quality content

### Quick Start Commands
```bash
# Start both servers (if using concurrently)
npm run dev

# Or start them separately:
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend/stacjit && npm run dev
```

### Development Workflow
1. **Backend Development:**
   - Make changes to `backend/` files
   - Server auto-restarts with nodemon
   - Check console for errors and logs

2. **Frontend Development:**
   - Make changes to `frontend/stacjit/src/` files
   - Vite provides hot module replacement
   - Changes reflect immediately in browser

3. **Database Changes:**
   - Update models in `backend/models/`
   - Restart backend server
   - Check MongoDB Atlas for data changes

### Key Features Walkthrough

#### Asking Questions
1. Click "Ask Question" in the navigation
2. Fill in the title and description
3. Use the rich text editor for formatting
4. Submit your question

#### Answering Questions
1. Navigate to any question
2. Scroll to the answer section
3. Use the rich text editor to write your answer
4. Submit your answer

#### Voting System
- Click the upvote (↑) or downvote (↓) buttons on questions and answers
- Your votes contribute to the community's content quality
- Vote counts are displayed separately for transparency

#### User Profiles
- Click on any username to view their profile
- See their questions, answers, and reputation
- Track their activity and contributions

#### Notifications
- Click the notification bell in the navbar
- View all your notifications
- Mark individual or all notifications as read

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user (protected)
```

### Question Endpoints
```
GET /api/questions - Get all questions
POST /api/questions - Create new question (protected)
GET /api/questions/:id - Get single question
PUT /api/questions/:id - Update question (protected)
DELETE /api/questions/:id - Delete question (protected)
POST /api/questions/:id/vote - Vote on question (protected)
```

### Answer Endpoints
```
POST /api/questions/:questionId/answers - Create answer (protected)
PUT /api/answers/:id - Update answer (protected)
DELETE /api/answers/:id - Delete answer (protected)
POST /api/answers/:id/vote - Vote on answer (protected)
POST /api/answers/:id/accept - Accept answer (protected)
```

### Notification Endpoints
```
GET /api/notifications - Get user notifications (protected)
PUT /api/notifications/:id/read - Mark notification as read (protected)
PUT /api/notifications/read-all - Mark all notifications as read (protected)
```

### User Endpoints
```
GET /api/users/:username - Get user profile
```

### System Endpoints
```
GET /api/health - Health check
GET /api/routes - API documentation
```

## 🏗️ Project Structure

```
StackIt/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middlewares/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── index.js             # Server entry point
│   └── package.json
├── frontend/
│   └── stacjit/
│       ├── src/
│       │   ├── Components/   # Reusable components
│       │   ├── Pages/        # Page components
│       │   ├── CSS/          # Stylesheets
│       │   ├── services/     # API services
│       │   ├── App.jsx       # Main app component
│       │   └── main.jsx      # Entry point
│       └── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevents abuse with request limiting
- **Helmet Security**: HTTP headers for security
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Authentication middleware for sensitive endpoints

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Use a process manager like PM2
3. Configure MongoDB Atlas for production
4. Set up proper CORS origins

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
**Server won't start:**
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000
# Kill the process or change PORT in .env

# MongoDB connection failed
# Verify your connection string in .env
# Check if IP is whitelisted in MongoDB Atlas
# Test connection: mongodb+srv://username:password@cluster.mongodb.net/test

# Module not found errors
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Environment variables missing:**
```bash
# Check if .env file exists in backend directory
ls -la backend/.env

# Create .env if missing
cp backend/.env.example backend/.env
# Then edit with your values
```

#### Frontend Issues
**Development server won't start:**
```bash
# Check if port 5173 is in use
# Vite will automatically use next available port

# Module not found errors
cd frontend/stacjit
rm -rf node_modules package-lock.json
npm install

# API connection issues
# Check if backend is running on port 5000
# Verify CORS settings in backend/index.js
```

**Build errors:**
```bash
# Clear cache and rebuild
cd frontend/stacjit
npm run build --force

# Check for syntax errors
npm run lint
```

#### Database Issues
**MongoDB Atlas connection:**
- Verify connection string format
- Check network connectivity
- Ensure IP whitelist includes your IP
- Test connection in MongoDB Compass

**Data not persisting:**
- Check if MongoDB Atlas cluster is active
- Verify database name in connection string
- Check for any network restrictions

#### Authentication Issues
**Login problems:**
```bash
# Clear browser localStorage
localStorage.clear()

# Check JWT token expiration
# Tokens expire after 30 days by default

# Verify backend is running
curl http://localhost:5000/api/health
```

**Registration issues:**
- Check if username/email already exists
- Verify password requirements
- Check backend logs for validation errors

### Performance Issues

**Slow loading:**
- Check MongoDB Atlas cluster performance
- Verify network connectivity
- Consider upgrading MongoDB Atlas tier

**Memory leaks:**
- Monitor Node.js memory usage
- Check for unclosed database connections
- Restart servers periodically during development

### Debug Mode

**Enable detailed logging:**
```bash
# Backend debug mode
cd backend
DEBUG=* npm run dev

# Frontend debug mode
cd frontend/stacjit
npm run dev -- --debug
```

**Check server logs:**
- Backend: Check terminal output for errors
- Frontend: Check browser console (F12)
- Database: Check MongoDB Atlas logs

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database hosting
- React community for excellent documentation
- Express.js team for the robust backend framework
- All contributors and users of StackIt

---

**StackIt** - Building a better Q&A community, one question at a time.
