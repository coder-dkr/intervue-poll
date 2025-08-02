const mongoose = require('mongoose');

const pollOptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
  isCorrect: { type: Boolean, default: false }
});

const pollSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  options: [pollOptionSchema],
  timeLimit: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  endTime: { type: Date },
  createdBy: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Poll', pollSchema);