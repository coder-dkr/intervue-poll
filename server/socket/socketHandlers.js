const pollController = require('../controllers/pollController');
const participantController = require('../controllers/participantController');
const chatController = require('../controllers/chatController');
const { validatePollData, validateChatMessage } = require('../middleware/validation');

class SocketHandlers {
  constructor(io) {
    this.io = io;
    this.pollTimers = new Map();
  }

  handleConnection(socket) {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('join', async (userData) => {
      try {
        socket.userId = userData.userId;
        socket.userType = userData.userType;
        
        await participantController.addParticipant(userData, socket.id);
        
        // Send current poll if exists
        const currentPoll = await pollController.getCurrentPoll();
        if (currentPoll) {
          socket.emit('newPoll', currentPoll);
        }

        // Send participant list to all users
        const participants = await participantController.getActiveParticipants();
        this.io.emit('participantsUpdate', participants);

        // Send chat history to new user
        const chatHistory = await chatController.getChatHistory();
        socket.emit('chatHistory', chatHistory);

      } catch (error) {
        console.error('Error handling join:', error);
        socket.emit('error', { message: 'Failed to join' });
      }
    });

    // Handle poll creation (teachers only)
    socket.on('createPoll', async (pollData) => {
      try {
        if (socket.userType !== 'teacher') {
          socket.emit('error', { message: 'Only teachers can create polls' });
          return;
        }

        const validation = validatePollData(pollData);
        if (!validation.isValid) {
          socket.emit('error', { message: validation.errors.join(', ') });
          return;
        }
        
        const poll = await pollController.createPoll(pollData, socket.id);
        
        // Send new poll to all users
        this.io.emit('newPoll', poll);

        // Start poll timer
        this.startPollTimer(poll.id, poll.timeLimit);

      } catch (error) {
        console.error('Error creating poll:', error);
        socket.emit('error', { message: 'Failed to create poll' });
      }
    });

    // Handle answer submission
    socket.on('submitAnswer', async (answerData) => {
      try {
        if (socket.userType !== 'student') {
          socket.emit('error', { message: 'Only students can submit answers' });
          return;
        }
        
        const poll = await pollController.submitAnswer(
          answerData.pollId, 
          answerData.optionId, 
          socket.userId
        );

        // Send updated results to all users
        this.io.emit('pollResults', poll.options);

        // Update participant status
        const participants = await participantController.getActiveParticipants();
        this.io.emit('participantsUpdate', participants);

      } catch (error) {
        console.error('Error submitting answer:', error);
        socket.emit('error', { message: 'Failed to submit answer' });
      }
    });

    // Handle chat messages
    socket.on('chatMessage', async (messageData) => {
      try {
        const validation = validateChatMessage(messageData);
        if (!validation.isValid) {
          socket.emit('error', { message: validation.errors.join(', ') });
          return;
        }

        const message = await chatController.saveMessage(messageData);
        
        // Broadcast message to all users
        this.io.emit('chatMessage', message);

      } catch (error) {
        console.error('Error handling chat message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle participant removal (teachers only)
    socket.on('removeParticipant', async (participantId) => {
      try {
        if (socket.userType !== 'teacher') {
          socket.emit('error', { message: 'Only teachers can remove participants' });
          return;
        }
        
        await participantController.removeParticipant(participantId);
        
        // Notify removed participant
        const participantSocket = Array.from(this.io.sockets.sockets.values())
          .find(s => s.userId === participantId);
        
        if (participantSocket) {
          participantSocket.emit('kicked');
          participantSocket.disconnect();
        }

        // Update participant list
        const participants = await participantController.getActiveParticipants();
        this.io.emit('participantsUpdate', participants);

      } catch (error) {
        console.error('Error removing participant:', error);
        socket.emit('error', { message: 'Failed to remove participant' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      try {
        await participantController.disconnectParticipant(socket.id);
        
        // Update participant list
        const participants = await participantController.getActiveParticipants();
        this.io.emit('participantsUpdate', participants);

      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  }

  startPollTimer(pollId, timeLimit) {
    let timeRemaining = timeLimit;
    
    const timer = setInterval(() => {
      timeRemaining -= 1;
      this.io.emit('timeUpdate', timeRemaining);

      if (timeRemaining <= 0) {
        clearInterval(timer);
        this.endPoll(pollId);
        this.pollTimers.delete(pollId);
      }
    }, 1000);

    this.pollTimers.set(pollId, timer);
  }

  async endPoll(pollId) {
    try {
      await pollController.endPoll(pollId);
      this.io.emit('pollEnded');
    } catch (error) {
      console.error('Error ending poll:', error);
    }
  }

  clearPollTimer(pollId) {
    const timer = this.pollTimers.get(pollId);
    if (timer) {
      clearInterval(timer);
      this.pollTimers.delete(pollId);
    }
  }
}

module.exports = SocketHandlers;