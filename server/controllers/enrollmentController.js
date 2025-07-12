const { validationResult } = require('express-validator');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { ValidationError, NotFoundError, AuthorizationError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Enroll in a course
exports.enrollInCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }

    const { courseId, startDate } = req.body;
    const studentId = req.user._id;

    // Check if course exists and is available
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new NotFoundError('Course not found'));
    }

    if (!course.isAvailable) {
      return next(new ValidationError('Course is not available for enrollment'));
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (existingEnrollment) {
      return next(new ValidationError('You are already enrolled in this course'));
    }

    // Check if course has available spots
    if (course.enrollment.currentStudents >= course.enrollment.maxStudents) {
      return next(new ValidationError('Course is full'));
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      startDate: startDate || new Date(),
      progress: {
        totalLessons: course.content.totalLessons
      }
    });

    // Update course enrollment count
    await course.addStudent();

    logger.info(`Student enrolled: ${req.user.email} in course ${course.title}`);

    res.status(201).json({
      message: 'Enrollment successful',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Get student's enrollments
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { student: req.user._id };
    
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .populate('course', 'title description category level instructor')
      .populate('course.instructor', 'firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ enrollmentDate: -1 });

    const total = await Enrollment.countDocuments(query);

    res.status(200).json({
      enrollments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course')
      .populate('student', 'firstName lastName email')
      .populate('course.instructor', 'firstName lastName email');

    if (!enrollment) {
      return next(new NotFoundError('Enrollment not found'));
    }

    // Check if user can view this enrollment
    if (req.user.role !== 'admin' && 
        enrollment.student._id.toString() !== req.user._id.toString() &&
        enrollment.course.instructor._id.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('Access denied'));
    }

    res.status(200).json({ enrollment });
  } catch (error) {
    next(error);
  }
};

// Update enrollment progress
exports.updateProgress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }

    const { completedLessons } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return next(new NotFoundError('Enrollment not found'));
    }

    // Check if user can update this enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('You can only update your own enrollment'));
    }

    await enrollment.updateProgress(completedLessons, enrollment.progress.totalLessons);

    logger.info(`Progress updated for enrollment: ${enrollment._id} by ${req.user.email}`);

    res.status(200).json({
      message: 'Progress updated successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Cancel enrollment
exports.cancelEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) {
      return next(new NotFoundError('Enrollment not found'));
    }

    // Check if user can cancel this enrollment
    if (req.user.role !== 'admin' && enrollment.student.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('You can only cancel your own enrollment'));
    }

    enrollment.status = 'cancelled';
    await enrollment.save();

    // Update course enrollment count
    const course = await Course.findById(enrollment.course);
    if (course) {
      await course.removeStudent();
    }

    logger.info(`Enrollment cancelled: ${enrollment._id} by ${req.user.email}`);

    res.status(200).json({
      message: 'Enrollment cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get course enrollments (instructor/admin only)
exports.getCourseEnrollments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const courseId = req.params.courseId;
    
    const query = { course: courseId };
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .populate('student', 'firstName lastName email profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ enrollmentDate: -1 });

    const total = await Enrollment.countDocuments(query);

    res.status(200).json({
      enrollments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    next(error);
  }
};

// Add payment to enrollment
exports.addPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }

    const { amount, method, transactionId } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return next(new NotFoundError('Enrollment not found'));
    }

    // Check if user can add payment to this enrollment
    if (req.user.role !== 'admin' && enrollment.student.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('Access denied'));
    }

    const payment = {
      amount,
      method,
      transactionId,
      status: 'completed',
      paidAt: new Date()
    };

    await enrollment.addPayment(payment);

    logger.info(`Payment added to enrollment: ${enrollment._id} by ${req.user.email}`);

    res.status(200).json({
      message: 'Payment added successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Mark attendance
exports.markAttendance = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }

    const { sessionId, status, notes } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return next(new NotFoundError('Enrollment not found'));
    }

    // Check if user can mark attendance
    if (req.user.role !== 'admin' && enrollment.student.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('Access denied'));
    }

    await enrollment.markAttendance(sessionId, status, notes);

    res.status(200).json({
      message: 'Attendance marked successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Add note to enrollment
exports.addNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array().map(e => e.msg).join(', ')));
    }

    const { content, type = 'instructor' } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return next(new NotFoundError('Enrollment not found'));
    }

    // Check if user can add notes
    if (req.user.role !== 'admin' && 
        enrollment.student.toString() !== req.user._id.toString() &&
        type === 'instructor') {
      return next(new AuthorizationError('Access denied'));
    }

    await enrollment.addNote(content, type);

    res.status(200).json({
      message: 'Note added successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Issue certificate
exports.issueCertificate = async (req, res, next) => {
  try {
    const { certificateId, downloadUrl } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return next(new NotFoundError('Enrollment not found'));
    }

    // Check if user can issue certificate
    if (req.user.role !== 'admin' && enrollment.student.toString() !== req.user._id.toString()) {
      return next(new AuthorizationError('Access denied'));
    }

    await enrollment.issueCertificate(certificateId, downloadUrl);

    logger.info(`Certificate issued for enrollment: ${enrollment._id} by ${req.user.email}`);

    res.status(200).json({
      message: 'Certificate issued successfully',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollment statistics
exports.getEnrollmentStats = async (req, res, next) => {
  try {
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const pendingEnrollments = await Enrollment.countDocuments({ status: 'pending' });

    const recentEnrollments = await Enrollment.find()
      .populate('student', 'firstName lastName')
      .populate('course', 'title')
      .sort({ enrollmentDate: -1 })
      .limit(5);

    res.status(200).json({
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      pendingEnrollments,
      recentEnrollments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentById,
  updateProgress,
  cancelEnrollment,
  getCourseEnrollments,
  addPayment,
  markAttendance,
  addNote,
  issueCertificate,
  getEnrollmentStats
}; 