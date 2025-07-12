const express = require('express');
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion
} = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getQuestions)
  .post(protect, createQuestion);

router.route('/:id')
  .get(getQuestion)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

router.post('/:id/vote', protect, voteQuestion);

module.exports = router;