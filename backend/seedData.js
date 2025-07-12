const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Question = require('./models/Question');
const Answer = require('./models/Answer');

// Sample users data
const sampleUsers = [
  {
    username: 'john_developer',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Full-stack developer passionate about React and Node.js',
    reputation: 150
  },
  {
    username: 'sarah_coder',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Python developer and data science enthusiast',
    reputation: 200
  },
  {
    username: 'mike_webdev',
    email: 'mike@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Frontend developer specializing in modern JavaScript',
    reputation: 120
  },
  {
    username: 'admin_user',
    email: 'admin@stackit.com',
    password: 'admin123',
    role: 'admin',
    bio: 'StackIt administrator',
    reputation: 500
  }
];

// Sample questions data
const sampleQuestions = [
  {
    title: "How to implement authentication in React with JWT?",
    description: "I'm building a React application and need to implement user authentication using JWT tokens. I've set up the backend with Express and JWT, but I'm not sure how to properly handle the authentication flow in React. What's the best way to store tokens, handle protected routes, and manage user state?",
    tags: ["react", "javascript", "jwt", "authentication", "frontend"],
    viewCount: 45,
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    title: "What's the difference between useState and useReducer in React?",
    description: "I've been using useState for state management in my React components, but I've heard that useReducer might be better for complex state logic. Can someone explain when to use each one and provide some practical examples?",
    tags: ["react", "hooks", "javascript", "state-management"],
    viewCount: 32,
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    title: "Best practices for MongoDB schema design",
    description: "I'm designing a new MongoDB database for a social media application. What are the best practices for schema design? Should I embed documents or use references? How do I handle relationships between users, posts, and comments?",
    tags: ["mongodb", "database", "schema-design", "nosql"],
    viewCount: 28,
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    title: "How to optimize Node.js performance?",
    description: "My Node.js application is experiencing performance issues. What are the best practices for optimizing Node.js applications? I'm particularly interested in memory management, async operations, and database query optimization.",
    tags: ["nodejs", "performance", "optimization", "javascript"],
    viewCount: 56,
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    title: "CSS Grid vs Flexbox: When to use which?",
    description: "I'm confused about when to use CSS Grid and when to use Flexbox for layouts. Both seem powerful but I'm not sure about the best use cases for each. Can someone explain the differences and when to choose one over the other?",
    tags: ["css", "grid", "flexbox", "layout", "frontend"],
    viewCount: 38,
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    title: "How to handle errors in async/await functions?",
    description: "I'm using async/await in my JavaScript code but I'm not sure about the best way to handle errors. Should I use try-catch blocks everywhere? What about error boundaries in React? Any best practices would be helpful.",
    tags: ["javascript", "async-await", "error-handling", "react"],
    viewCount: 42,
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    title: "Docker containerization best practices",
    description: "I'm containerizing my Node.js application with Docker. What are the best practices for creating efficient Docker images? How do I handle environment variables, multi-stage builds, and security concerns?",
    tags: ["docker", "containerization", "devops", "nodejs"],
    viewCount: 25,
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    title: "RESTful API design principles",
    description: "I'm designing a RESTful API for my application. What are the key principles I should follow? How do I structure endpoints, handle authentication, and implement proper HTTP status codes?",
    tags: ["api", "rest", "backend", "http"],
    viewCount: 34,
    votes: {
      upvotes: [],
      downvotes: []
    }
  }
];

// Sample answers data
const sampleAnswers = [
  {
    content: "For JWT authentication in React, I recommend using a combination of localStorage for token storage and a context provider for user state. Here's a basic implementation:\n\n```javascript\n// AuthContext.js\nconst AuthContext = createContext();\n\nexport const AuthProvider = ({ children }) => {\n  const [user, setUser] = useState(null);\n  const [token, setToken] = useState(localStorage.getItem('token'));\n  \n  const login = (userData, token) => {\n    setUser(userData);\n    setToken(token);\n    localStorage.setItem('token', token);\n  };\n  \n  const logout = () => {\n    setUser(null);\n    setToken(null);\n    localStorage.removeItem('token');\n  };\n  \n  return (\n    <AuthContext.Provider value={{ user, token, login, logout }}>\n      {children}\n    </AuthContext.Provider>\n  );\n};\n```\n\nFor protected routes, you can create a PrivateRoute component that checks for authentication.",
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    content: "useState is perfect for simple state management, while useReducer is better for complex state logic. Here's when to use each:\n\n**useState:**\n- Simple state updates\n- Independent state values\n- Component-level state\n\n**useReducer:**\n- Complex state logic\n- Multiple related state values\n- Predictable state transitions\n\nExample with useReducer:\n```javascript\nconst initialState = { count: 0, isLoading: false, error: null };\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'increment':\n      return { ...state, count: state.count + 1 };\n    case 'setLoading':\n      return { ...state, isLoading: action.payload };\n    default:\n      return state;\n  }\n}\n```",
    votes: {
      upvotes: [],
      downvotes: []
    }
  },
  {
    content: "For MongoDB schema design, consider these principles:\n\n1. **Embedding vs Referencing:**\n   - Embed for small, related data (user preferences)\n   - Reference for large, independent data (user posts)\n\n2. **Denormalization:**\n   - Duplicate data for read performance\n   - Keep critical data in main documents\n\n3. **Indexing:**\n   - Index frequently queried fields\n   - Use compound indexes for complex queries\n\nExample schema:\n```javascript\n// User document\n{\n  _id: ObjectId,\n  username: String,\n  email: String,\n  profile: {\n    bio: String,\n    avatar: String\n  },\n  preferences: {\n    theme: String,\n    notifications: Boolean\n  }\n}\n\n// Post document\n{\n  _id: ObjectId,\n  author: ObjectId, // Reference to User\n  title: String,\n  content: String,\n  tags: [String],\n  createdAt: Date\n}\n```",
    votes: {
      upvotes: [],
      downvotes: []
    }
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/stackit?retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed users
const seedUsers = async () => {
  try {
    console.log('🌱 Seeding users...');
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create users with hashed passwords
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      users.push(await user.save());
    }
    
    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

// Seed questions
const seedQuestions = async (users) => {
  try {
    console.log('🌱 Seeding questions...');
    
    // Clear existing questions
    await Question.deleteMany({});
    
    // Create questions with random authors
    const questions = [];
    for (let i = 0; i < sampleQuestions.length; i++) {
      const questionData = sampleQuestions[i];
      const author = users[i % users.length]; // Distribute authors
      
      const question = new Question({
        ...questionData,
        author: author._id
      });
      questions.push(await question.save());
    }
    
    console.log(`✅ Created ${questions.length} questions`);
    return questions;
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    throw error;
  }
};

// Seed answers
const seedAnswers = async (users, questions) => {
  try {
    console.log('🌱 Seeding answers...');
    
    // Clear existing answers
    await Answer.deleteMany({});
    
    // Create answers
    const answers = [];
    for (let i = 0; i < sampleAnswers.length; i++) {
      const answerData = sampleAnswers[i];
      const author = users[i % users.length];
      const question = questions[i % questions.length];
      
      const answer = new Answer({
        ...answerData,
        author: author._id,
        question: question._id
      });
      answers.push(await answer.save());
      
      // Add answer to question
      question.answers.push(answer._id);
      await question.save();
    }
    
    console.log(`✅ Created ${answers.length} answers`);
    return answers;
  } catch (error) {
    console.error('❌ Error seeding answers:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    await connectDB();
    
    // Seed data in order
    const users = await seedUsers();
    const questions = await seedQuestions(users);
    await seedAnswers(users, questions);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample Data Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`❓ Questions: ${questions.length}`);
    console.log(`💬 Answers: ${sampleAnswers.length}`);
    
    console.log('\n🔑 Test Accounts:');
    users.forEach(user => {
      console.log(`   Username: ${user.username} | Email: ${user.email} | Password: ${sampleUsers.find(u => u.email === user.email).password}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase(); 