import express from "express"
import { getAllPatients, getPatientById, sendOtp, sendOtpByUHID, verifyOtp } from "../controllers/patient.controller.js"


const patientRoute = express.Router()


patientRoute.post("/sendOtp",sendOtp)
patientRoute.post("/verify-otp", verifyOtp);
patientRoute.post('/send-otp-uhid', sendOtpByUHID);
patientRoute.get('/patients', getAllPatients);
patientRoute.get('/patients/:id', getPatientById);





export default patientRoute;