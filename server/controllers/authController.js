const { validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword, generateToken, generateRefreshToken } = require('../middleware/auth');
const { AppError, ValidationError, AuthenticationError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }
    const { firstName, lastName, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 409));
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone
    });
    logger.info(`User registered: ${user.email}`);
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.security.loginAttempt(req.ip, email, false, 'User not found');
      return next(new AuthenticationError('Invalid credentials'));
    }
    if (!user.isActive) {
      logger.security.loginAttempt(req.ip, email, false, 'Account deactivated');
      return next(new AuthenticationError('Account is deactivated'));
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      logger.security.loginAttempt(req.ip, email, false, 'Wrong password');
      await user.incLoginAttempts();
      return next(new AuthenticationError('Invalid credentials'));
    }
    await user.resetLoginAttempts();
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    logger.security.loginAttempt(req.ip, email, true);
    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user (client should delete token)
exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

// Refresh JWT token
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new ValidationError('Refresh token required'));
    }
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return next(new AuthenticationError('Invalid refresh token'));
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AuthenticationError('User not found'));
    }
    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

// Email verification (stub)
exports.verifyEmail = async (req, res, next) => {
  // Implement email verification logic here
  res.status(200).json({ message: 'Email verified (stub)' });
}; 