import Patient from '../models/patient.model.js';

// Middleware to check if the patient exists by number
export const checkPatientByNumber = async (req, res, next) => {
  const { number } = req.body;
  let patient = await Patient.findOne({ number });

  if (!patient) {
    patient = new Patient({ number });
    await patient.save();
  }
  req.patient = patient;
  next();
};

// Middleware to check if the patient exists by UHID
export const checkPatientByUHID = async (req, res, next) => {
  const { uhid } = req.body;
  let patient = await Patient.findOne({ UHID: uhid });

  if (!patient) {
    return res.status(404).json({ message: "Patient with this UHID not found" });
  }

  req.patient = patient;
  next();
};

// Middleware to verify OTP
export const verifyOtpMiddleware = async (req, res, next) => {
  const { otp } = req.body;
  const patient = req.patient;

  if (!patient.otp || patient.otp !== otp || patient.otpExpire < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // OTP is valid, continue to the next step
  next();
};
