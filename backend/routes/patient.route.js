// routes/patient.route.js
import express from "express";
import {
  getAllPatients,
  getPatientById,
  getPatientReports,
  registerPatient,
  sendOtp,
  sendOtpByUHID,
  uploadMultipleReports,
  uploadReport,
  verifyOtp,
} from "../controllers/patient.controller.js";
import { singleUpload, multipleUpload } from "../middleware/multer.js";

const patientRoute = express.Router();

patientRoute.post("/sendOtp", sendOtp);
patientRoute.post("/verify-otp", verifyOtp);
patientRoute.post("/send-otp-uhid", sendOtpByUHID);
patientRoute.get("/patients", getAllPatients);
patientRoute.get("/patients/:id", getPatientById);
patientRoute.post("/register", registerPatient);


// Use `singleUpload` for single file uploads
patientRoute.post('/upload-report', singleUpload, uploadReport);

// Use `multipleUpload` for multiple file uploads
patientRoute.post('/upload-multiple-reports', multipleUpload, uploadMultipleReports);

patientRoute.get('/reports/:id', getPatientReports);

// Use singleUpload for single file uploads
patientRoute.post("/upload-report", singleUpload, uploadReport);

// Use multipleUpload for multiple file uploads
patientRoute.post(
  "/upload-multiple-reports",
  multipleUpload,
  uploadMultipleReports
);

patientRoute.get("/reports/:id", getPatientReports);


export default patientRoute;
