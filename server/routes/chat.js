const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get chat history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = await chatController.getChatHistory(limit);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;