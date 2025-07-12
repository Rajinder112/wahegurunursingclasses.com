const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled', 'suspended'],
    default: 'pending'
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  completionDate: Date,
  progress: {
    completedLessons: {
      type: Number,
      default: 0
    },
    totalLessons: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  },
  grades: {
    overall: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    assignments: [{
      title: String,
      score: Number,
      maxScore: Number,
      submittedAt: Date,
      gradedAt: Date,
      feedback: String
    }],
    quizzes: [{
      title: String,
      score: Number,
      maxScore: Number,
      completedAt: Date
    }]
  },
  attendance: [{
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    },
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'absent'
    },
    notes: String
  }],
  payments: [{
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date
  }],
  totalPaid: {
    type: Number,
    default: 0
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateId: String,
    downloadUrl: String
  },
  notes: {
    student: [{
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    instructor: [{
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for enrollment duration
enrollmentSchema.virtual('duration').get(function() {
  if (!this.completionDate) return null;
  return Math.ceil((this.completionDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Virtual for days since enrollment
enrollmentSchema.virtual('daysSinceEnrollment').get(function() {
  return Math.ceil((Date.now() - this.enrollmentDate) / (1000 * 60 * 60 * 24));
});

// Virtual for payment status
enrollmentSchema.virtual('paymentStatus').get(function() {
  if (this.payments.length === 0) return 'unpaid';
  const completedPayments = this.payments.filter(p => p.status === 'completed');
  if (completedPayments.length === 0) return 'pending';
  return 'paid';
});

// Indexes for performance
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });
enrollmentSchema.index({ enrollmentDate: -1 });
enrollmentSchema.index({ 'progress.lastAccessed': -1 });

// Pre-save middleware to update progress percentage
enrollmentSchema.pre('save', function(next) {
  if (this.progress.totalLessons > 0) {
    this.progress.percentage = Math.round((this.progress.completedLessons / this.progress.totalLessons) * 100);
  }
  
  // Update total paid amount
  this.totalPaid = this.payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  next();
});

// Static method to find active enrollments
enrollmentSchema.statics.findActive = function() {
  return this.find({ status: 'active', isActive: true });
};

// Static method to find enrollments by student
enrollmentSchema.statics.findByStudent = function(studentId) {
  return this.find({ student: studentId }).populate('course');
};

// Static method to find enrollments by course
enrollmentSchema.statics.findByCourse = function(courseId) {
  return this.find({ course: courseId }).populate('student');
};

// Instance method to update progress
enrollmentSchema.methods.updateProgress = function(completedLessons, totalLessons) {
  this.progress.completedLessons = completedLessons;
  this.progress.totalLessons = totalLessons;
  this.progress.lastAccessed = new Date();
  
  if (totalLessons > 0) {
    this.progress.percentage = Math.round((completedLessons / totalLessons) * 100);
  }
  
  // Mark as completed if all lessons are done
  if (this.progress.percentage >= 100 && this.status === 'active') {
    this.status = 'completed';
    this.completionDate = new Date();
  }
  
  return this.save();
};

// Instance method to add payment
enrollmentSchema.methods.addPayment = function(paymentData) {
  this.payments.push(paymentData);
  return this.save();
};

// Instance method to mark attendance
enrollmentSchema.methods.markAttendance = function(sessionId, status, notes = '') {
  this.attendance.push({
    session: sessionId,
    date: new Date(),
    status,
    notes
  });
  return this.save();
};

// Instance method to add note
enrollmentSchema.methods.addNote = function(content, type = 'instructor') {
  this.notes[type].push({
    content,
    createdAt: new Date()
  });
  return this.save();
};

// Instance method to issue certificate
enrollmentSchema.methods.issueCertificate = function(certificateId, downloadUrl) {
  this.certificate.issued = true;
  this.certificate.issuedAt = new Date();
  this.certificate.certificateId = certificateId;
  this.certificate.downloadUrl = downloadUrl;
  return this.save();
};

module.exports = mongoose.model('Enrollment', enrollmentSchema); 