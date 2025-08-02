const validatePollData = (pollData) => {
  const errors = [];

  if (!pollData.question || pollData.question.trim().length === 0) {
    errors.push('Question is required');
  }

  if (!pollData.options || !Array.isArray(pollData.options) || pollData.options.length < 2) {
    errors.push('At least 2 options are required');
  }

  if (pollData.options) {
    pollData.options.forEach((option, index) => {
      if (!option.text || option.text.trim().length === 0) {
        errors.push(`Option ${index + 1} text is required`);
      }
    });
  }

  if (!pollData.timeLimit || pollData.timeLimit < 15 || pollData.timeLimit > 60) {
    errors.push('Time limit must be between 15 and 60 seconds');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateChatMessage = (messageData) => {
  const errors = [];

  if (!messageData.message || messageData.message.trim().length === 0) {
    errors.push('Message is required');
  }

  if (messageData.message && messageData.message.length > 500) {
    errors.push('Message must be less than 500 characters');
  }

  if (!messageData.userId || !messageData.userName) {
    errors.push('User information is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validatePollData,
  validateChatMessage
};