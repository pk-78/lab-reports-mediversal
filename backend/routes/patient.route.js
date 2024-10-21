import express from "express";
import {
  getAllPatients,
  getPatientById,
  getPatientReports,
  registerPatient,
  sendOtp,
  sendOtpByUHID,
  uploadReport,
  verifyOtp,
} from "../controllers/patient.controller.js";
import upload from "../middleware/multer.js";

const patientRoute = express.Router();

patientRoute.post("/sendOtp", sendOtp);
patientRoute.post("/verify-otp", verifyOtp);
patientRoute.post("/send-otp-uhid", sendOtpByUHID);
patientRoute.get("/patients", getAllPatients);
patientRoute.get("/patients/:id", getPatientById);
patientRoute.post("/register", registerPatient);
patientRoute.post('/upload-report', upload.single('reportFile'), uploadReport);
patientRoute.get('/reports/:id', getPatientReports);



export default patientRoute;
