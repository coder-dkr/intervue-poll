const Participant = require('../models/Participant');

class ParticipantController {
  async addParticipant(userData, socketId) {
    try {
      // Remove existing participant with same ID if exists
      await Participant.deleteOne({ id: userData.userId });

      const participant = new Participant({
        id: userData.userId,
        name: userData.userName,
        userType: userData.userType,
        socketId: socketId,
        isActive: true
      });

      await participant.save();
      return participant;
    } catch (error) {
      throw new Error('Failed to add participant: ' + error.message);
    }
  }

  async removeParticipant(userId) {
    try {
      await Participant.deleteOne({ id: userId });
      return true;
    } catch (error) {
      throw new Error('Failed to remove participant: ' + error.message);
    }
  }

  async getActiveParticipants() {
    try {
      const participants = await Participant.find({ isActive: true })
        .sort({ joinedAt: 1 });
      
      return participants;
    } catch (error) {
      throw new Error('Failed to get participants: ' + error.message);
    }
  }

  async updateSocketId(userId, socketId) {
    try {
      await Participant.updateOne(
        { id: userId },
        { socketId: socketId }
      );
      return true;
    } catch (error) {
      throw new Error('Failed to update socket ID: ' + error.message);
    }
  }

  async getParticipantById(userId) {
    try {
      const participant = await Participant.findOne({ id: userId, isActive: true });
      return participant;
    } catch (error) {
      throw new Error('Failed to get participant: ' + error.message);
    }
  }

  async disconnectParticipant(socketId) {
    try {
      await Participant.deleteOne({ socketId: socketId });
      return true;
    } catch (error) {
      throw new Error('Failed to disconnect participant: ' + error.message);
    }
  }
}

module.exports = new ParticipantController();