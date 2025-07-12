const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { loginRateLimit } = require('../middleware/auth');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('firstName').isString().isLength({ min: 2, max: 50 }).trim().escape(),
    body('lastName').isString().isLength({ min: 2, max: 50 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8 }),
    body('phone').isString().isLength({ min: 7, max: 16 }).trim().escape()
  ],
  authController.register
);

// Login
router.post(
  '/login',
  loginRateLimit,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8 })
  ],
  authController.login
);

// Logout
router.post('/logout', authController.logout);

// Refresh token
router.post('/refresh', authController.refresh);

// Email verification (stub)
router.get('/verify-email', authController.verifyEmail);

module.exports = router; 