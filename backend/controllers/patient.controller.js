import otpGenerator from 'otp-generator';
import Patient from '../models/patient.model.js';

export const sendOtp = async (req, res) => {
  const { number } = req.body;

  let patient = await Patient.findOne({ number });
  if (!patient) {
    patient = new Patient({ number });
  }

  const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });

  const otpExpire = Date.now() + 5 * 60 * 1000;

  patient.otp = otp;
  patient.otpExpire = otpExpire;
  await patient.save();

  res.status(200).json({ message: "OTP sent successfully", otp });
};

export const verifyOtp = async (req, res) => {
    const { number, otp } = req.body;
  
    const patient = await Patient.findOne({ number });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
  
    if (patient.otp !== otp || patient.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  
    const token = jwt.sign({ id: patient._id, number: patient.number }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    patient.otp = undefined;
    patient.otpExpire = undefined;
    await patient.save();
  
    res.status(200).json({ message: "OTP verified successfully", token });
  };

