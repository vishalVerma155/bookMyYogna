const mongoose = require('mongoose');

const panditCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
  },
  poojaTypes: {
    type: [String], // e.g., ['Griha Pravesh', 'Satyanarayan Katha']
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  experience: {
    type: Number, // in years
    required: true
  },
  language: {
    type: [String], // e.g., ['Hindi', 'Sanskrit', 'English']
    default: []
  }
}, {
  timestamps: true
});

const PanditCard = mongoose.model('PanditCard', panditCardSchema);

module.exports = PanditCard;
