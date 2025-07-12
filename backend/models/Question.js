const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
    minlength: 5
  },
  tags: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  },
  votes: {
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    downvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for vote score
questionSchema.virtual('voteScore').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Indexes for better performance
questionSchema.index({ tags: 1 });
questionSchema.index({ author: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Question', questionSchema);