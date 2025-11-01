const mongoose = require('mongoose');

/**
 * Event Schema
 * Defines the structure for calendar events
 */
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Validation for new documents
        if (this.startTime && value) {
          return value > this.startTime;
        }
        return true;
      },
      message: 'End time must be after start time'
    }
  },
  allDay: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#4285f4' // Default blue color
  },
  location: {
    type: String,
    default: '',
    maxlength: 200
  },
  recurring: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'none'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
eventSchema.index({ startTime: 1, endTime: 1 });
eventSchema.index({ startTime: 1 });
eventSchema.index({ endTime: 1 });

/**
 * Middleware: Validate endTime > startTime and update updatedAt before saving
 */
eventSchema.pre('save', function(next) {
  // Validate endTime is after startTime
  if (this.endTime && this.startTime && this.endTime <= this.startTime) {
    return next(new Error('End time must be after start time'));
  }
  this.updatedAt = Date.now();
  next();
});

/**
 * Middleware: Validate endTime > startTime before findOneAndUpdate
 */
eventSchema.pre(['findOneAndUpdate', 'findByIdAndUpdate'], function(next) {
  const update = this.getUpdate();
  // Handle both direct update and $set operator
  const updateData = update.$set || update;
  
  if (updateData && updateData.endTime && updateData.startTime) {
    const endTime = new Date(updateData.endTime);
    const startTime = new Date(updateData.startTime);
    
    if (isNaN(endTime.getTime()) || isNaN(startTime.getTime())) {
      return next(new Error('Invalid date format'));
    }
    
    if (endTime <= startTime) {
      return next(new Error('End time must be after start time'));
    }
  }
  // For partial updates (only one date field), validation is handled in routes
  next();
});

module.exports = mongoose.model('Event', eventSchema);

