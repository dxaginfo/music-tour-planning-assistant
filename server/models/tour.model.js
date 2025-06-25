const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        // End date must be after start date
        return value >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  description: {
    type: String,
    trim: true
  },
  bandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band'
  },
  budget: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'cancelled'],
    default: 'planning'
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['tour_manager', 'band_member', 'crew', 'agent'],
      required: true
    },
    permissions: {
      type: [String],
      enum: ['read', 'write', 'admin'],
      default: ['read']
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

// Virtual for getting events
tourSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'tourId'
});

// Virtual for getting expenses
tourSchema.virtual('expenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'tourId'
});

// Virtual for getting revenue
tourSchema.virtual('revenue', {
  ref: 'Revenue',
  localField: '_id',
  foreignField: 'tourId'
});

// Method to calculate total expenses
tourSchema.methods.calculateTotalExpenses = async function() {
  const expenses = await mongoose.model('Expense').find({ tourId: this._id });
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Method to calculate total revenue
tourSchema.methods.calculateTotalRevenue = async function() {
  const revenue = await mongoose.model('Revenue').find({ tourId: this._id });
  return revenue.reduce((total, rev) => total + rev.amount, 0);
};

// Method to check if user is a member of the tour
tourSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString());
};

// Method to check if user has specific permission
tourSchema.methods.hasPermission = function(userId, permission) {
  const member = this.members.find(member => member.user.toString() === userId.toString());
  if (!member) return false;
  
  if (member.permissions.includes('admin')) return true;
  if (permission === 'read' && member.permissions.includes('read')) return true;
  if (permission === 'write' && member.permissions.includes('write')) return true;
  
  return false;
};

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;