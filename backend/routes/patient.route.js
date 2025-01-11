// routes/patient.route.js
import express from "express";
import {
  bulkUploadPatients,
  downloadFile,
  fetchReportsCountLast15Days,
  fetchReportsWithCount,
  getAllPatients,
  getPatientById,
  getPatientReports,
  getUHIDsByNumber,
  registerPatient,
  sendWay2mintOtp,
  sendWay2mintOtpByUhid,
  uploadMultipleReports,
  uploadReport,
  verifyOtp,
  verifyOtpByUhid,
} from "../controllers/patient.controller.js";
import { upload } from "../middleware/csvmulte.js";
import { multipleUpload, singleUpload } from "../middleware/multer.js";

const patientRoute = express.Router();

patientRoute.post("/sendwayOtp", sendWay2mintOtp);
patientRoute.post("/sendwayOtpuhid", sendWay2mintOtpByUhid);
patientRoute.post("/verify-otp", verifyOtp);
patientRoute.post("/verify-otp-uhid", verifyOtpByUhid);
patientRoute.get("/patients", getAllPatients);
patientRoute.get("/patients/:id", getPatientById);
patientRoute.post("/register", registerPatient);

// Use `singleUpload` for single file uploads
patientRoute.post("/upload-report", singleUpload, uploadReport);

// Use `multipleUpload` for multiple file uploads
patientRoute.post(
  "/upload-multiple-reports",
  multipleUpload,
  uploadMultipleReports
);

patientRoute.get("/reports/:id", getPatientReports);

// Use singleUpload for single file uploads
patientRoute.post("/upload-report", singleUpload, uploadReport);

// Use multipleUpload for multiple file uploads
patientRoute.post(
  "/upload-multiple-reports",
  multipleUpload,
  uploadMultipleReports
);

patientRoute.get("/reports/:id", getPatientReports);
patientRoute.post("/getUHIDsByNumber", getUHIDsByNumber);

patientRoute.get("/download", downloadFile);

patientRoute.post("/bulk-upload", upload.single("csvFile"), bulkUploadPatients);
patientRoute.get("/reports15days", fetchReportsCountLast15Days);

export default patientRoute;
