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
    required: false,
  },
  otpExpire: {
    type: Date,
    required: false,

  },
  UHID: {
    type: String,
    unique: true,  
  },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
