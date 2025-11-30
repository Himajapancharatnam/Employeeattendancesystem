const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    time: {
      type: Date
    },
    location: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    }
  },
  checkOut: {
    time: {
      type: Date
    },
    location: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    }
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day', 'on-leave'],
    default: 'present'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
attendanceSchema.index({ user: 1, date: -1 });
attendanceSchema.index({ date: -1 });

// Calculate total hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.checkIn.time && this.checkOut.time) {
    const diff = this.checkOut.time - this.checkIn.time;
    this.totalHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
  }
  next();
});

// Virtual to check if checked in today
attendanceSchema.virtual('isCheckedIn').get(function() {
  return this.checkIn.time && !this.checkOut.time;
});

module.exports = mongoose.model('Attendance', attendanceSchema);
