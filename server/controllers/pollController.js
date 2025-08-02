const Poll = require('../models/Poll');
const Participant = require('../models/Participant');

class PollController {
  async createPoll(pollData, teacherId) {
    try {
      const pollId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      const poll = new Poll({
        id: pollId,
        question: pollData.question,
        options: pollData.options.map(opt => ({
          ...opt,
          votes: 0
        })),
        timeLimit: pollData.timeLimit,
        createdBy: teacherId,
        isActive: true
      });

      await poll.save();
      
      // Reset all participants' answer status
      await Participant.updateMany(
        { isActive: true },
        { hasAnswered: false, currentAnswer: null }
      );

      return poll;
    } catch (error) {
      throw new Error('Failed to create poll: ' + error.message);
    }
  }

  async submitAnswer(pollId, optionId, userId) {
    try {
      const poll = await Poll.findOne({ id: pollId, isActive: true });
      if (!poll) {
        throw new Error('Poll not found or inactive');
      }

      // Check if user already answered
      const participant = await Participant.findOne({ id: userId });
      if (participant && participant.hasAnswered) {
        throw new Error('You have already answered this poll');
      }

      // Update participant's answer status
      await Participant.updateOne(
        { id: userId },
        { hasAnswered: true, currentAnswer: optionId }
      );

      // Update vote count
      const optionIndex = poll.options.findIndex(opt => opt.id === optionId);
      if (optionIndex !== -1) {
        poll.options[optionIndex].votes += 1;
        await poll.save();
      }

      return poll;
    } catch (error) {
      throw new Error('Failed to submit answer: ' + error.message);
    }
  }

  async endPoll(pollId) {
    try {
      const poll = await Poll.findOneAndUpdate(
        { id: pollId },
        { isActive: false, endTime: new Date() },
        { new: true }
      );

      return poll;
    } catch (error) {
      throw new Error('Failed to end poll: ' + error.message);
    }
  }

  async getPollHistory() {
    try {
      const polls = await Poll.find({})
        .sort({ createdAt: -1 })
        .limit(50);
      
      return polls;
    } catch (error) {
      throw new Error('Failed to get poll history: ' + error.message);
    }
  }

  async getPollById(pollId) {
    try {
      const poll = await Poll.findOne({ id: pollId });
      return poll;
    } catch (error) {
      throw new Error('Failed to get poll: ' + error.message);
    }
  }

  async getCurrentPoll() {
    try {
      const poll = await Poll.findOne({ isActive: true })
        .sort({ createdAt: -1 });
      
      return poll;
    } catch (error) {
      throw new Error('Failed to get current poll: ' + error.message);
    }
  }
}

module.exports = new PollController();