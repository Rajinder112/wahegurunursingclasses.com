const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AuthenticationError, AuthorizationError } = require('./errorHandler');
const logger = require('../config/logger');
const User = require('../models/User');

// JWT token verification middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.security.suspiciousActivity(req.ip, 'MISSING_TOKEN', {
        url: req.originalUrl,
        method: req.method
      });
      throw new AuthenticationError('Access token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      logger.security.suspiciousActivity(req.ip, 'INVALID_TOKEN_USER', {
        userId: decoded.userId,
        url: req.originalUrl
      });
      throw new AuthenticationError('User no longer exists');
    }

    // Check if user is active
    if (!user.isActive) {
      logger.security.suspiciousActivity(req.ip, 'INACTIVE_USER_ACCESS', {
        userId: user._id,
        email: user.email
      });
      throw new AuthenticationError('Account is deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.security.suspiciousActivity(req.ip, 'INVALID_TOKEN', {
        url: req.originalUrl,
        error: error.message
      });
      throw new AuthenticationError('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      logger.security.suspiciousActivity(req.ip, 'EXPIRED_TOKEN', {
        url: req.originalUrl
      });
      throw new AuthenticationError('Token expired');
    }
    next(error);
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      logger.security.suspiciousActivity(req.ip, 'UNAUTHORIZED_ACCESS', {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
        url: req.originalUrl
      });
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

// Optional authentication (doesn't throw error if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Don't throw error, just continue without user
    next();
  }
};

// Rate limiting for login attempts
const loginRateLimit = (req, res, next) => {
  const key = `login_attempts:${req.ip}`;
  const maxAttempts = parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 5;
  const windowMs = parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;

  // This would typically use Redis or a similar store
  // For now, we'll use a simple in-memory approach (not recommended for production)
  if (!req.app.locals.loginAttempts) {
    req.app.locals.loginAttempts = new Map();
  }

  const attempts = req.app.locals.loginAttempts.get(key) || { count: 0, resetTime: Date.now() + windowMs };

  if (Date.now() > attempts.resetTime) {
    attempts.count = 0;
    attempts.resetTime = Date.now() + windowMs;
  }

  if (attempts.count >= maxAttempts) {
    logger.security.rateLimitExceeded(req.ip, 'LOGIN');
    return res.status(429).json({
      error: 'Too many login attempts. Please try again later.',
      retryAfter: Math.ceil((attempts.resetTime - Date.now()) / 1000)
    });
  }

  attempts.count++;
  req.app.locals.loginAttempts.set(key, attempts);
  next();
};

// Password strength validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  authenticateToken,
  authorize,
  optionalAuth,
  loginRateLimit,
  validatePassword,
  generateToken,
  generateRefreshToken,
  hashPassword,
  comparePassword
}; 