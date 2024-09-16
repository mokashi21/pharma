const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  speciality: {
    type: String,
    required: true
  },
  empId: {
    type: String,
    required: true
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
