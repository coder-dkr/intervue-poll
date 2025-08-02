const ChatMessage = require('../models/ChatMessage');

class ChatController {
  async saveMessage(messageData) {
    try {
      const messageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      const chatMessage = new ChatMessage({
        id: messageId,
        userId: messageData.userId,
        userName: messageData.userName,
        userType: messageData.userType,
        message: messageData.message,
        timestamp: new Date()
      });

      await chatMessage.save();
      return chatMessage;
    } catch (error) {
      throw new Error('Failed to save message: ' + error.message);
    }
  }

  async getChatHistory(limit = 50) {
    try {
      const messages = await ChatMessage.find({})
        .sort({ timestamp: -1 })
        .limit(limit);
      
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      throw new Error('Failed to get chat history: ' + error.message);
    }
  }
}

module.exports = new ChatController();