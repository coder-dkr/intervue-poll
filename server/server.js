const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import configurations and middleware
const connectDB = require('./config/database');
const { authenticateUser } = require('./middleware/auth');

// Import routes
const pollRoutes = require('./routes/polls');
const participantRoutes = require('./routes/participants');
const chatRoutes = require('./routes/chat');

// Import socket handlers
const SocketHandlers = require('./socket/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://intervue-poll-three.vercel.app",
    methods: ["GET", "POST"]
  }
});
// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   }
// });

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize socket handlers
const socketHandlers = new SocketHandlers(io);

// Socket.io connection handling
io.use(authenticateUser);
io.on('connection', (socket) => {
  socketHandlers.handleConnection(socket);
});

// REST API routes
app.use('/api/polls', pollRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});