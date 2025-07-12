const { validationResult } = require('express-validator');
const User = require('../models/User');
const { ValidationError, NotFoundError, AuthorizationError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }
    const { firstName, lastName, phone, profile, preferences } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, profile, preferences },
      { new: true, runValidators: true }
    ).select('-password');
    logger.info(`User profile updated: ${user.email}`);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new ValidationError('Current password is incorrect'));
    }
    user.password = newPassword;
    await user.save();
    logger.info(`Password changed for user: ${user.email}`);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Update user (admin only)
exports.updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }
    const { firstName, lastName, email, phone, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    logger.info(`User updated by admin: ${user.email}`);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    logger.info(`User deleted by admin: ${user.email}`);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Deactivate user account
exports.deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true }
    ).select('-password');
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    logger.info(`User account deactivated: ${user.email}`);
    res.status(200).json({ message: 'Account deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

// Reactivate user account (admin only)
exports.reactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    logger.info(`User account reactivated by admin: ${user.email}`);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Get user statistics (admin only)
exports.getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const students = await User.countDocuments({ role: 'student' });
    const instructors = await User.countDocuments({ role: 'instructor' });
    const admins = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({
      totalUsers,
      activeUsers,
      students,
      instructors,
      admins,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
}; 