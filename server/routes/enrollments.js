const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', enrollmentController.getAllEnrollments);
router.get('/:id', enrollmentController.getEnrollmentById);

// Protected routes (require authentication)
router.post('/', auth, enrollmentController.createEnrollment);
router.put('/:id', auth, enrollmentController.updateEnrollment);
router.delete('/:id', auth, enrollmentController.deleteEnrollment);

// Admin routes
router.get('/admin/all', auth, enrollmentController.getAllEnrollmentsAdmin);
router.put('/admin/:id/status', auth, enrollmentController.updateEnrollmentStatus);

module.exports = router; 