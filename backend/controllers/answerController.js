const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create new answer
// @route   POST /api/questions/:questionId/answers
// @access  Private
const createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const questionId = req.params.questionId;
    
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    const answer = await Answer.create({
      content,
      author: req.user.id,
      question: questionId
    });
    
    // Add answer to question
    question.answers.push(answer._id);
    await question.save();
    
    // Add answer to user's answers
    await User.findByIdAndUpdate(req.user.id, {
      $push: { answersGiven: answer._id }
    });
    
    // Create notification for question author
    if (question.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: question.author,
        sender: req.user.id,
        type: 'answer',
        message: `${req.user.username} answered your question: ${question.title}`,
        relatedQuestion: questionId,
        relatedAnswer: answer._id
      });
    }
    
    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username avatar bio reputation');
    
    res.status(201).json({
      success: true,
      answer: populatedAnswer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private
const updateAnswer = async (req, res) => {
  try {
    let answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }
    
    // Check if user owns answer or is admin
    if (answer.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this answer'
      });
    }
    
    answer = await Answer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'username avatar bio reputation');
    
    res.json({
      success: true,
      answer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }
    
    // Check if user owns answer or is admin
    if (answer.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this answer'
      });
    }
    
    // Remove answer from question
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id }
    });
    
    await Answer.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Vote on answer
// @route   POST /api/answers/:id/vote
// @access  Private
const voteAnswer = async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }
    
    const userId = req.user.id;
    
    // Remove existing votes
    answer.votes.upvotes.pull(userId);
    answer.votes.downvotes.pull(userId);
    
    // Add new vote
    if (type === 'upvote') {
      answer.votes.upvotes.push(userId);
    } else if (type === 'downvote') {
      answer.votes.downvotes.push(userId);
    }
    
    await answer.save();
    
    res.json({
      success: true,
      voteScore: answer.votes.upvotes.length - answer.votes.downvotes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Accept answer
// @route   POST /api/answers/:id/accept
// @access  Private
const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }
    
    const question = await Question.findById(answer.question);
    
    // Check if user owns the question
    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only question author can accept answers'
      });
    }
    
    // Remove previous accepted answer
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, {
        isAccepted: false
      });
    }
    
    // Set new accepted answer
    answer.isAccepted = true;
    await answer.save();
    
    question.acceptedAnswer = answer._id;
    question.isResolved = true;
    await question.save();
    
    // Create notification for answer author
    if (answer.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: answer.author,
        sender: req.user.id,
        type: 'accepted_answer',
        message: `Your answer was accepted for: ${question.title}`,
        relatedQuestion: question._id,
        relatedAnswer: answer._id
      });
    }
    
    res.json({
      success: true,
      message: 'Answer accepted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer
};