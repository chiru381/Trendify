import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeImage: {
    type: String, 
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
