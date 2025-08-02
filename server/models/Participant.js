const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userType: { type: String, enum: ['student', 'teacher'], required: true },
  socketId: { type: String, required: true },
  hasAnswered: { type: Boolean, default: false },
  currentAnswer: { type: String, default: null },
  joinedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Participant', participantSchema);