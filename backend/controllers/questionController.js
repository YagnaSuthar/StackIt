const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { tags, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const questions = await Question.find(query)
      .populate('author', 'username avatar')
      .populate('acceptedAnswer')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Question.countDocuments(query);
    
    res.json({
      success: true,
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar bio reputation')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar bio reputation'
        }
      })
      .populate('acceptedAnswer');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Increment view count
    question.viewCount += 1;
    await question.save();
    
    res.json({
      success: true,
      question,
      answers: question.answers || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    const question = await Question.create({
      title,
      description,
      tags,
      author: req.user.id
    });
    
    // Add question to user's questions
    await User.findByIdAndUpdate(req.user.id, {
      $push: { questionsAsked: question._id }
    });
    
    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username avatar');
    
    res.status(201).json({
      success: true,
      question: populatedQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
const updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Check if user owns question or is admin
    if (question.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question'
      });
    }
    
    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'username avatar');
    
    res.json({
      success: true,
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Check if user owns question or is admin
    if (question.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Vote on question
// @route   POST /api/questions/:id/vote
// @access  Private
const voteQuestion = async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    const userId = req.user.id;
    
    // Remove existing votes
    question.votes.upvotes.pull(userId);
    question.votes.downvotes.pull(userId);
    
    // Add new vote
    if (type === 'upvote') {
      question.votes.upvotes.push(userId);
    } else if (type === 'downvote') {
      question.votes.downvotes.push(userId);
    }
    
    await question.save();
    
    res.json({
      success: true,
      voteScore: question.votes.upvotes.length - question.votes.downvotes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion
};