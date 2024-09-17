const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  prefix: {
    type: String,
    enum: ['Dr.'],
    default: 'Dr.',
  },
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
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v); // Basic email validation
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  speciality: {
    type: String,
    required: true
  },
  visitType: {
    type: String,
    enum: ['single', 'double'],
    required: true,
  },
  empId: {
    type: String,
    required: true
  },
  isReported: {
    type: Boolean,
    default: false,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medical_rep', 
  },
  reportDate: {
    type: Date,
    default: null,
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
