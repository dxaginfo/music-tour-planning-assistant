const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Tour ID is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  category: {
    type: String,
    enum: ['transportation', 'accommodation', 'food', 'equipment', 'merchandise', 'personnel', 'venue', 'marketing', 'other'],
    required: [true, 'Expense category is required']
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Expense amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3
  },
  date: {
    type: Date,
    required: [true, 'Expense date is required'],
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  vendor: {
    name: String,
    contactInfo: String
  },
  receipt: {
    type: String // URL to receipt image
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User who paid the expense is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'reimbursed', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  tags: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient querying
expenseSchema.index({ tourId: 1, date: -1 });
expenseSchema.index({ tourId: 1, category: 1 });
expenseSchema.index({ paidBy: 1 });

// Virtual for event details (when eventId is provided)
expenseSchema.virtual('event', {
  ref: 'Event',
  localField: 'eventId',
  foreignField: '_id',
  justOne: true
});

// Static method to calculate total expenses for a tour
expenseSchema.statics.getTotalExpensesByTour = async function(tourId) {
  const result = await this.aggregate([
    { $match: { tourId: mongoose.Types.ObjectId(tourId) } },
    { $group: { 
      _id: null, 
      total: { $sum: '$amount' }
    }}
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

// Static method to get expense summary by category
expenseSchema.statics.getExpenseSummaryByCategory = async function(tourId) {
  return this.aggregate([
    { $match: { tourId: mongoose.Types.ObjectId(tourId) } },
    { $group: { 
      _id: '$category', 
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }},
    { $sort: { total: -1 } }
  ]);
};

// Static method to get daily expense totals
expenseSchema.statics.getDailyExpenseTotals = async function(tourId) {
  return this.aggregate([
    { $match: { tourId: mongoose.Types.ObjectId(tourId) } },
    { $group: { 
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, 
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }},
    { $sort: { _id: 1 } }
  ]);
};

// Method to update status with approval
expenseSchema.methods.approve = function(userId) {
  this.status = 'approved';
  this.approvedBy = userId;
  this.approvedAt = new Date();
  return this.save();
};

// Method to reimburse expense
expenseSchema.methods.reimburse = function() {
  this.status = 'reimbursed';
  return this.save();
};

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;