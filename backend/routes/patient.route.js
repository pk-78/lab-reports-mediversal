// routes/patient.route.js
import express from "express";
import {

  downloadFile,

  bulkUploadPatients,

  getAllPatients,
  getPatientById,
  getPatientReports,
  getUHIDsByNumber,
  registerPatient,
  sendOtp,
  sendOtpByUHID,
  uploadMultipleReports,
  uploadReport,
  verifyOtp,
  verifyOtpByUhid,
} from "../controllers/patient.controller.js";
import { multipleUpload, singleUpload } from "../middleware/multer.js";
import { upload } from "../middleware/csvmulte.js";

const patientRoute = express.Router();

patientRoute.post("/sendOtp", sendOtp);
patientRoute.post("/verify-otp", verifyOtp);
patientRoute.post("/verify-otp-uhid", verifyOtpByUhid);
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
patientRoute.post('/getUHIDsByNumber', getUHIDsByNumber);

patientRoute.get('/download',downloadFile)

patientRoute.post("/bulk-upload", upload.single("csvFile"), bulkUploadPatients);




export default patientRoute;
