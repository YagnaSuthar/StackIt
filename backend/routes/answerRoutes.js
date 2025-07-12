const express = require('express');
const {
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer
} = require('../controllers/answerController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Update specific answer
router.put('/:id', protect, updateAnswer);

// Delete specific answer
router.delete('/:id', protect, deleteAnswer);

// Vote on specific answer
router.post('/:id/vote', protect, voteAnswer);

// Accept specific answer
router.post('/:id/accept', protect, acceptAnswer);

module.exports = router;