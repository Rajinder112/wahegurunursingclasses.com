const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Contact form submission
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('subject').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Subject must be between 2 and 100 characters')
], async (req, res) => {
  try {
    // Import validation result
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message, countryCode } = req.body;

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'wahegurunursingclasses@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'wahegurunursingclasses@gmail.com',
      to: 'wahegurunursingclasses@gmail.com',
      subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${countryCode || ''} ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>This message was sent from the Waheguru Nursing Classes contact form.</em></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log the contact form submission
    logger.info(`Contact form submitted by ${name} (${email})`);

    res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours!',
      data: {
        name,
        email,
        phone: countryCode ? `${countryCode} ${phone}` : phone,
        subject: subject || 'General Inquiry',
        message
      }
    });

  } catch (error) {
    logger.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
});

module.exports = router; 