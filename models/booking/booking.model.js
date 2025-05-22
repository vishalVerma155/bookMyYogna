const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  poojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pooja',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoojaPlans',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['bookingPending', 'bookingConfirmed', 'completed', 'bookingCancelled'],
    default: 'bookingPending'
  },
  amount: {
    type: Number,
    required: true
  },
  dateOfDelivery: {
    type: Date,
    required: true
  },
  poojaMode: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },
}, {
  timestamps: true
});

const Booking = mongoose.model('Order', orderSchema);

module.exports = Booking;