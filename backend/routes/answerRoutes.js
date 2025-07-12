const express = require('express');
const {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer
} = require('../controllers/answerController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create answer for a question
router.post('/questions/:questionId/answers', protect, createAnswer);

// Update specific answer
router.put('/answers/:id', protect, updateAnswer);

// Delete specific answer
router.delete('/answers/:id', protect, deleteAnswer);

// Vote on specific answer
router.post('/answers/:id/vote', protect, voteAnswer);

// Accept specific answer
router.post('/answers/:id/accept', protect, acceptAnswer);

module.exports = router;