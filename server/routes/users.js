const express = require('express');
const router = express.Router();

// Simple status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'User service is running',
    timestamp: new Date().toISOString()
  });
});

// Placeholder endpoints
router.get('/', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'User service requires database connection',
    timestamp: new Date().toISOString()
  });
});

router.get('/:id', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'User service requires database connection',
    timestamp: new Date().toISOString()
  });
});

router.put('/:id', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'User service requires database connection',
    timestamp: new Date().toISOString()
  });
});

router.delete('/:id', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'User service requires database connection',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 