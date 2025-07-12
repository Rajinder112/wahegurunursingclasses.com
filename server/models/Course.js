const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [1000, 'Course description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: ['NCLEX-USA', 'NCLEX-NZ', 'OSCE-CBT', 'General Nursing', 'Specialized']
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  duration: {
    type: Number,
    required: [true, 'Course duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  content: {
    modules: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      duration: {
        type: Number,
        min: 1
      },
      lessons: [{
        title: {
          type: String,
          required: true,
          trim: true
        },
        type: {
          type: String,
          enum: ['video', 'text', 'quiz', 'assignment'],
          default: 'text'
        },
        content: {
          type: String,
          trim: true
        },
        videoUrl: String,
        duration: Number,
        order: Number
      }]
    }],
    totalLessons: {
      type: Number,
      default: 0
    },
    totalDuration: {
      type: Number,
      default: 0
    }
  },
  requirements: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  materials: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['pdf', 'video', 'audio', 'link'],
      required: true
    },
    url: String,
    fileSize: Number,
    description: String
  }],
  schedule: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    sessions: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      time: String,
      duration: Number,
      type: {
        type: String,
        enum: ['live', 'recorded', 'hybrid'],
        default: 'live'
      }
    }]
  },
  enrollment: {
    maxStudents: {
      type: Number,
      default: 50,
      min: [1, 'Maximum students must be at least 1']
    },
    currentStudents: {
      type: Number,
      default: 0
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    enrollmentDeadline: Date
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'suspended'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  certificate: {
    enabled: {
      type: Boolean,
      default: true
    },
    requirements: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for enrollment percentage
courseSchema.virtual('enrollmentPercentage').get(function() {
  if (this.enrollment.maxStudents === 0) return 0;
  return Math.round((this.enrollment.currentStudents / this.enrollment.maxStudents) * 100);
});

// Virtual for course availability
courseSchema.virtual('isAvailable').get(function() {
  return this.isActive && 
         this.status === 'published' && 
         this.enrollment.isOpen && 
         this.enrollment.currentStudents < this.enrollment.maxStudents;
});

// Virtual for course progress (for enrolled students)
courseSchema.virtual('progress').get(function() {
  // This would be calculated based on student progress
  return 0;
});

// Indexes for performance
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ status: 1, isActive: 1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ 'schedule.startDate': 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ ratings: -1 });

// Pre-save middleware to update totals
courseSchema.pre('save', function(next) {
  if (this.content.modules) {
    this.content.totalLessons = this.content.modules.reduce((total, module) => {
      return total + (module.lessons ? module.lessons.length : 0);
    }, 0);
    
    this.content.totalDuration = this.content.modules.reduce((total, module) => {
      return total + (module.duration || 0);
    }, 0);
  }
  next();
});

// Static method to find available courses
courseSchema.statics.findAvailable = function() {
  return this.find({
    isActive: true,
    status: 'published',
    'enrollment.isOpen': true,
    $expr: { $lt: ['$enrollment.currentStudents', '$enrollment.maxStudents'] }
  });
};

// Static method to find courses by instructor
courseSchema.statics.findByInstructor = function(instructorId) {
  return this.find({ instructor: instructorId });
};

// Instance method to add student
courseSchema.methods.addStudent = function() {
  if (this.enrollment.currentStudents >= this.enrollment.maxStudents) {
    throw new Error('Course is full');
  }
  this.enrollment.currentStudents += 1;
  return this.save();
};

// Instance method to remove student
courseSchema.methods.removeStudent = function() {
  if (this.enrollment.currentStudents > 0) {
    this.enrollment.currentStudents -= 1;
  }
  return this.save();
};

// Instance method to update rating
courseSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = totalRating / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
  return this.save();
};

module.exports = mongoose.model('Course', courseSchema); 