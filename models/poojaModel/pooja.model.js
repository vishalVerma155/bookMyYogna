const mongoose = require('mongoose');

// Plan schema (sub-document)
const planSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    amount: { type: Number, required: true },
    features: { type: [String], default: [] },
    durationOfPooja: { type: String, required: true }, // e.g., "2 hours"
    numberOfDays: { type: Number, required: true },
    poojaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pooja',
    }
}, { timestamps: true });

// Main Pooja schema
const poojaSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    image: { type: String },
    subHeading: { type: String },
    description: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    benefitsOfPooja: { type: [String], default: [] },
    poojaVideo: { type: String }, // URL to video
    poojaPlans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoojaPlans',
    }]
}, {
    timestamps: true
});

const Pooja = mongoose.model('Pooja', poojaSchema);
const PoojaPlans = mongoose.model('PoojaPlans', planSchema);


module.exports = { Pooja, PoojaPlans };
