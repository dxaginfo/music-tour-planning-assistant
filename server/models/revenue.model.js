const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Tour ID is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  source: {
    type: String,
    enum: ['ticket_sales', 'merchandise', 'sponsorship', 'streaming', 'licensing', 'other'],
    required: [true, 'Revenue source is required']
  },
  amount: {
    type: Number,
    required: [true, 'Revenue amount is required'],
    min: [0, 'Revenue amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3
  },
  date: {
    type: Date,
    required: [true, 'Revenue date is required'],
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  payer: {
    name: String,
    contactInfo: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'check', 'credit_card', 'bank_transfer', 'paypal', 'other'],
    default: 'cash'
  },
  receiptNumber: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'received', 'cancelled'],
    default: 'pending'
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receivedAt: {
    type: Date
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true
  },
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

// Index for efficient querying
revenueSchema.index({ tourId: 1, date: -1 });
revenueSchema.index({ tourId: 1, source: 1 });
revenueSchema.index({ eventId: 1 });

// Virtual for event details (when eventId is provided)
revenueSchema.virtual('event', {
  ref: 'Event',
  localField: 'eventId',
  foreignField: '_id',
  justOne: true
});

// Static method to calculate total revenue for a tour
revenueSchema.statics.getTotalRevenueByTour = async function(tourId) {
  const result = await this.aggregate([
    { $match: { tourId: mongoose.Types.ObjectId(tourId) } },
    { $group: { 
      _id: null, 
      total: { $sum: '$amount' }
    }}
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

// Static method to get revenue summary by source
revenueSchema.statics.getRevenueSummaryBySource = async function(tourId) {
  return this.aggregate([
    { $match: { tourId: mongoose.Types.ObjectId(tourId) } },
    { $group: { 
      _id: '$source', 
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }},
    { $sort: { total: -1 } }
  ]);
};

// Static method to get revenue by event
revenueSchema.statics.getRevenueByEvent = async function(tourId) {
  return this.aggregate([
    { $match: { 
      tourId: mongoose.Types.ObjectId(tourId),
      eventId: { $exists: true, $ne: null }
    }},
    { $group: { 
      _id: '$eventId', 
      total: { $sum: '$amount' }
    }},
    { $lookup: {
      from: 'events',
      localField: '_id',
      foreignField: '_id',
      as: 'event'
    }},
    { $unwind: '$event' },
    { $sort: { 'event.startDateTime': 1 } }
  ]);
};

// Method to mark revenue as received
revenueSchema.methods.markAsReceived = function(userId) {
  this.status = 'received';
  this.receivedBy = userId;
  this.receivedAt = new Date();
  return this.save();
};

// Method to calculate settlement amount (after expenses)
revenueSchema.methods.calculateSettlement = async function() {
  const Expense = mongoose.model('Expense');
  
  let relatedExpenses = 0;
  if (this.eventId) {
    // Get expenses related to this event
    const expenses = await Expense.find({ eventId: this.eventId });
    relatedExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  }
  
  return {
    revenue: this.amount,
    expenses: relatedExpenses,
    settlement: this.amount - relatedExpenses
  };
};

const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = Revenue;