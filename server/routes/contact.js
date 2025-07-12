const express = require('express');
const router = express.Router();

// Simple status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'Contact service is running',
    timestamp: new Date().toISOString()
  });
});

// Placeholder contact form endpoint
router.post('/', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'Contact form service requires email configuration',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 