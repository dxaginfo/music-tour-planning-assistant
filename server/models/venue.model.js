const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  capacity: {
    type: Number,
    min: 0
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return v.startsWith('http://') || v.startsWith('https://');
      },
      message: props => `${props.value} is not a valid URL`
    }
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String,
    role: String
  },
  technicalRequirements: {
    type: String,
    trim: true
  },
  amenities: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  pastPerformances: [{
    date: Date,
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour'
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    notes: String
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
venueSchema.index({ location: '2dsphere' });
venueSchema.index({ name: 'text', 'address.city': 'text' });

// Virtual for upcoming events at this venue
venueSchema.virtual('upcomingEvents', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'venueId',
  options: {
    match: {
      startDateTime: { $gte: new Date() }
    },
    sort: { startDateTime: 1 }
  }
});

// Method to find nearby venues
venueSchema.statics.findNearby = async function(coordinates, maxDistance = 50000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

// Method to get full address as a string
venueSchema.methods.getFullAddress = function() {
  const { street, city, state, zipCode, country } = this.address;
  return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
};

// Method to update past performances
venueSchema.methods.addPastPerformance = function(performance) {
  this.pastPerformances.push(performance);
  return this.save();
};

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;