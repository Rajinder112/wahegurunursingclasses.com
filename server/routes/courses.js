const express = require('express');
const { body, query, param } = require('express-validator');
const courseController = require('../controllers/courseController');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.get('/', courseController.getAllCourses);

router.get('/featured', courseController.getFeaturedCourses);

router.get(
  '/:id',
  [
    param('id').isMongoId()
  ],
  optionalAuth,
  courseController.getCourseById
);

// Protected routes (authentication required)
router.use(authenticateToken);

// Create course (instructor/admin only)
router.post(
  '/',
  authorize('instructor', 'admin'),
  [
    body('title').isString().isLength({ min: 5, max: 100 }).trim().escape(),
    body('description').isString().isLength({ min: 10, max: 1000 }).trim().escape(),
    body('category').isIn(['NCLEX-USA', 'NCLEX-NZ', 'OSCE-CBT', 'General Nursing', 'Specialized']),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    body('duration').isInt({ min: 1 }),
    body('price').isFloat({ min: 0 }),
    body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD']),
    body('instructor').optional().isMongoId(),
    body('requirements').optional().isArray(),
    body('requirements.*').optional().isString().trim().escape(),
    body('learningOutcomes').optional().isArray(),
    body('learningOutcomes.*').optional().isString().trim().escape(),
    body('schedule.startDate').isISO8601(),
    body('schedule.endDate').isISO8601(),
    body('enrollment.maxStudents').optional().isInt({ min: 1 }),
    body('enrollment.enrollmentDeadline').optional().isISO8601(),
    body('tags').optional().isArray(),
    body('tags.*').optional().isString().trim().escape()
  ],
  courseController.createCourse
);

// Update course (instructor/admin only)
router.put(
  '/:id',
  authorize('instructor', 'admin'),
  [
    param('id').isMongoId(),
    body('title').optional().isString().isLength({ min: 5, max: 100 }).trim().escape(),
    body('description').optional().isString().isLength({ min: 10, max: 1000 }).trim().escape(),
    body('category').optional().isIn(['NCLEX-USA', 'NCLEX-NZ', 'OSCE-CBT', 'General Nursing', 'Specialized']),
    body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    body('duration').optional().isInt({ min: 1 }),
    body('price').optional().isFloat({ min: 0 }),
    body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD']),
    body('requirements').optional().isArray(),
    body('requirements.*').optional().isString().trim().escape(),
    body('learningOutcomes').optional().isArray(),
    body('learningOutcomes.*').optional().isString().trim().escape(),
    body('schedule.startDate').optional().isISO8601(),
    body('schedule.endDate').optional().isISO8601(),
    body('enrollment.maxStudents').optional().isInt({ min: 1 }),
    body('enrollment.enrollmentDeadline').optional().isISO8601(),
    body('tags').optional().isArray(),
    body('tags.*').optional().isString().trim().escape()
  ],
  courseController.updateCourse
);

// Delete course (instructor/admin only)
router.delete(
  '/:id',
  authorize('instructor', 'admin'),
  [
    param('id').isMongoId()
  ],
  courseController.deleteCourse
);

// Get instructor's courses
router.get(
  '/instructor/my-courses',
  authorize('instructor', 'admin'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['draft', 'published', 'archived', 'suspended'])
  ],
  courseController.getInstructorCourses
);

// Add review to course (students only)
router.post(
  '/:id/reviews',
  authorize('student'),
  [
    param('id').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isString().isLength({ max: 500 }).trim().escape()
  ],
  courseController.addReview
);

// Get course statistics (instructor/admin only)
router.get(
  '/:id/stats',
  authorize('instructor', 'admin'),
  [
    param('id').isMongoId()
  ],
  courseController.getCourseStats
);

// Toggle course status (instructor/admin only)
router.patch(
  '/:id/status',
  authorize('instructor', 'admin'),
  [
    param('id').isMongoId(),
    body('status').isIn(['draft', 'published', 'archived', 'suspended'])
  ],
  courseController.toggleCourseStatus
);

module.exports = router; 