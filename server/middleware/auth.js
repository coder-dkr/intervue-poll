const authenticateUser = (socket, next) => {
  // Basic authentication middleware for socket connections
  if (socket.handshake.auth && socket.handshake.auth.token) {
    // Add token validation logic here if needed
    next();
  } else {
    // For now, allow all connections
    next();
  }
};

const validateUserType = (allowedTypes) => {
  return (socket, next) => {
    if (allowedTypes.includes(socket.userType)) {
      next();
    } else {
      next(new Error('Unauthorized user type'));
    }
  };
};

module.exports = {
  authenticateUser,
  validateUserType
};