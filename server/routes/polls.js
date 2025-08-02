const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

// Get poll history
router.get('/history', async (req, res) => {
  try {
    const polls = await pollController.getPollHistory();
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current active poll
router.get('/current', async (req, res) => {
  try {
    const poll = await pollController.getCurrentPoll();
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get poll by ID
router.get('/:id', async (req, res) => {
  try {
    const poll = await pollController.getPollById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;