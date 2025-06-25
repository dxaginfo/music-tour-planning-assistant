const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Tour ID is required']
  },
  type: {
    type: String,
    enum: ['show', 'travel', 'day_off', 'press', 'other'],
    required: [true, 'Event type is required']
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  startDateTime: {
    type: Date,
    required: [true, 'Start date and time is required']
  },
  endDateTime: {
    type: Date,
    required: [true, 'End date and time is required'],
    validate: {
      validator: function(value) {
        // End date must be after start date
        return value >= this.startDateTime;
      },
      message: 'End date/time must be after or equal to start date/time'
    }
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  },
  location: {
    name: String,
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  details: {
    loadInTime: Date,
    soundCheckTime: Date,
    doorsTime: Date,
    setTime: Date,
    merchandiseDetails: String,
    specialInstructions: String
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient querying by date ranges
eventSchema.index({ tourId: 1, startDateTime: 1 });
eventSchema.index({ tourId: 1, type: 1 });

// Virtual for venue details (when venueId is provided)
eventSchema.virtual('venue', {
  ref: 'Venue',
  localField: 'venueId',
  foreignField: '_id',
  justOne: true
});

// Method to check for scheduling conflicts with other events
eventSchema.methods.checkForConflicts = async function(excludeId = null) {
  const query = {
    tourId: this.tourId,
    $or: [
      // Event starts during another event
      {
        startDateTime: { $lte: this.startDateTime },
        endDateTime: { $gt: this.startDateTime }
      },
      // Event ends during another event
      {
        startDateTime: { $lt: this.endDateTime },
        endDateTime: { $gte: this.endDateTime }
      },
      // Event encompasses another event
      {
        startDateTime: { $gte: this.startDateTime },
        endDateTime: { $lte: this.endDateTime }
      }
    ]
  };
  
  // Exclude self when checking for conflicts
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflicts = await mongoose.model('Event').find(query);
  return conflicts;
};

// Method to get travel time to the next event
eventSchema.methods.getTravelTimeToNextEvent = async function() {
  const nextEvent = await mongoose.model('Event').findOne({
    tourId: this.tourId,
    startDateTime: { $gt: this.endDateTime }
  }).sort({ startDateTime: 1 });
  
  if (!nextEvent) return null;
  
  // Calculate travel time in hours
  const travelTime = (nextEvent.startDateTime - this.endDateTime) / (1000 * 60 * 60);
  return travelTime;
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;