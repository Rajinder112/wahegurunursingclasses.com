const express = require('express');
const { body, query, param } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get current user profile
router.get('/profile', userController.getProfile);

// Update current user profile
router.put(
  '/profile',
  [
    body('firstName').optional().isString().isLength({ min: 2, max: 50 }).trim().escape(),
    body('lastName').optional().isString().isLength({ min: 2, max: 50 }).trim().escape(),
    body('phone').optional().isString().isLength({ min: 7, max: 16 }).trim().escape(),
    body('profile.bio').optional().isString().isLength({ max: 500 }).trim().escape(),
    body('profile.address.street').optional().isString().trim().escape(),
    body('profile.address.city').optional().isString().trim().escape(),
    body('profile.address.state').optional().isString().trim().escape(),
    body('profile.address.zipCode').optional().isString().trim().escape(),
    body('profile.address.country').optional().isString().trim().escape(),
    body('profile.emergencyContact.name').optional().isString().trim().escape(),
    body('profile.emergencyContact.relationship').optional().isString().trim().escape(),
    body('profile.emergencyContact.phone').optional().isString().trim().escape(),
    body('preferences.notifications.email').optional().isBoolean(),
    body('preferences.notifications.sms').optional().isBoolean(),
    body('preferences.notifications.push').optional().isBoolean(),
    body('preferences.language').optional().isIn(['en', 'es', 'fr']),
    body('preferences.timezone').optional().isString().trim().escape()
  ],
  userController.updateProfile
);

// Change password
router.put(
  '/change-password',
  [
    body('currentPassword').isString().isLength({ min: 8 }),
    body('newPassword').isString().isLength({ min: 8 })
  ],
  userController.changePassword
);

// Deactivate account
router.put('/deactivate', userController.deactivateAccount);

// Admin routes
router.get(
  '/',
  authorize('admin'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(['student', 'instructor', 'admin']),
    query('isActive').optional().isBoolean()
  ],
  userController.getAllUsers
);

router.get(
  '/stats',
  authorize('admin'),
  userController.getUserStats
);

router.get(
  '/:id',
  authorize('admin'),
  [
    param('id').isMongoId()
  ],
  userController.getUserById
);

router.put(
  '/:id',
  authorize('admin'),
  [
    param('id').isMongoId(),
    body('firstName').optional().isString().isLength({ min: 2, max: 50 }).trim().escape(),
    body('lastName').optional().isString().isLength({ min: 2, max: 50 }).trim().escape(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().isString().isLength({ min: 7, max: 16 }).trim().escape(),
    body('role').optional().isIn(['student', 'instructor', 'admin']),
    body('isActive').optional().isBoolean()
  ],
  userController.updateUser
);

router.delete(
  '/:id',
  authorize('admin'),
  [
    param('id').isMongoId()
  ],
  userController.deleteUser
);

router.put(
  '/:id/reactivate',
  authorize('admin'),
  [
    param('id').isMongoId()
  ],
  userController.reactivateAccount
);

module.exports = router; 