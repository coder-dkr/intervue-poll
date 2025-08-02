const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

// Get all active participants
router.get('/', async (req, res) => {
  try {
    const participants = await participantController.getActiveParticipants();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get participant by ID
router.get('/:id', async (req, res) => {
  try {
    const participant = await participantController.getParticipantById(req.params.id);
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;