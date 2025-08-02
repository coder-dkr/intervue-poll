const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userType: { type: String, enum: ['student', 'teacher'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);