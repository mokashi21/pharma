const mongoose = require('mongoose');

// Define the schema for check-ins
const checkInSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  location: {
    type: { type: String }, // GeoJSON format
    coordinates: [Number], // [longitude, latitude]
  },
  
});

// Create and export the CheckIn model
const CheckIn = mongoose.model('CheckIn', checkInSchema);
module.exports = CheckIn;
