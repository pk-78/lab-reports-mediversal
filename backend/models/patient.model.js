import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpire: {
    type: Date,
    required: true,
  },
  UHID: {
    type: String,
    unique: true,  
  },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
