const express = require('express');
const router = express.Router();

// Simple status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'Authentication service is running',
    timestamp: new Date().toISOString()
  });
});

// Placeholder endpoints (will be implemented when database is connected)
router.post('/register', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'Registration service requires database connection',
    timestamp: new Date().toISOString()
  });
});

router.post('/login', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'Login service requires database connection',
    timestamp: new Date().toISOString()
  });
});

router.post('/logout', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'Logout service requires database connection',
    timestamp: new Date().toISOString()
  });
});

router.post('/refresh', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'Token refresh service requires database connection',
    timestamp: new Date().toISOString()
  });
});

router.get('/verify-email', (req, res) => {
  res.status(503).json({
    error: 'Service temporarily unavailable',
    message: 'Email verification service requires database connection',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 