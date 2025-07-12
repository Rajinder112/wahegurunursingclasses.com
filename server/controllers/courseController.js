const { validationResult } = require('express-validator');
const Course = require('../models/Course');
const { ValidationError, NotFoundError, AuthorizationError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Get all courses (public)
exports.getAllCourses = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      level, 
      instructor, 
      status = 'published',
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    if (status) query.status = status;
    if (category) query.category = category;
    if (level) query.level = level;
    if (instructor) query.instructor = instructor;
    if (featured !== undefined) query.featured = featured === 'true';

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    next(error);
  }
};

// Get course by ID (public)
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email profile')
      .populate('reviews.user', 'firstName lastName profile.avatar');

    if (!course) {
      return next(new NotFoundError('Course not found'));
    }

    if (course.status !== 'published' && !req.user) {
      return next(new NotFoundError('Course not found'));
    }

    res.status(200).json({ course });
  } catch (error) {
    next(error);
  }
};

// Create course (instructor/admin only)
exports.createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }

    const courseData = {
      ...req.body,
      instructor: req.user.role === 'admin' ? req.body.instructor : req.user._id
    };

    const course = await Course.create(courseData);
    logger.info(`Course created: ${course.title} by ${req.user.email}`);

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// Update course (instructor/admin only)
exports.updateCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(new NotFoundError('Course not found'));
    }

    // Check if user can update this course
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('You can only update your own courses'));
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName email');

    logger.info(`Course updated: ${updatedCourse.title} by ${req.user.email}`);

    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    next(error);
  }
};

// Delete course (instructor/admin only)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(new NotFoundError('Course not found'));
    }

    // Check if user can delete this course
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('You can only delete your own courses'));
    }

    await Course.findByIdAndDelete(req.params.id);
    logger.info(`Course deleted: ${course.title} by ${req.user.email}`);

    res.status(200).json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get instructor's courses
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { instructor: req.user._id };
    
    if (status) query.status = status;

    const courses = await Course.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.status(200).json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    next(error);
  }
};

// Add review to course (enrolled students only)
exports.addReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }

    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return next(new NotFoundError('Course not found'));
    }

    // Check if user has already reviewed this course
    const existingReview = course.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return next(new ValidationError('You have already reviewed this course'));
    }

    // Add review
    course.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    // Update average rating
    await course.updateRating();

    logger.info(`Review added to course: ${course.title} by ${req.user.email}`);

    res.status(201).json({
      message: 'Review added successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// Get course statistics (instructor/admin only)
exports.getCourseStats = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(new NotFoundError('Course not found'));
    }

    // Check if user can view stats
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('Access denied'));
    }

    const stats = {
      totalStudents: course.enrollment.currentStudents,
      enrollmentPercentage: course.enrollmentPercentage,
      averageRating: course.ratings.average,
      totalReviews: course.ratings.count,
      totalLessons: course.content.totalLessons,
      totalDuration: course.content.totalDuration
    };

    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
};

// Toggle course status (instructor/admin only)
exports.toggleCourseStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return next(new NotFoundError('Course not found'));
    }

    // Check if user can update this course
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('You can only update your own courses'));
    }

    course.status = status;
    await course.save();

    logger.info(`Course status updated: ${course.title} to ${status} by ${req.user.email}`);

    res.status(200).json({
      message: 'Course status updated successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// Get featured courses (public)
exports.getFeaturedCourses = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    
    const courses = await Course.find({
      isActive: true,
      status: 'published',
      featured: true
    })
    .populate('instructor', 'firstName lastName')
    .limit(parseInt(limit))
    .sort({ ratings: -1, createdAt: -1 });

    res.status(200).json({ courses });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  addReview,
  getCourseStats,
  toggleCourseStatus,
  getFeaturedCourses
}; 