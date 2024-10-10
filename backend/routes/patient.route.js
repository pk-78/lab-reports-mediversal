import express from "express"
import { sendOtp, sendOtpByUHID, verifyOtp } from "../controllers/patient.controller.js"


const patientRoute = express.Router()


patientRoute.post("/sendOtp",sendOtp)
patientRoute.post("/verify-otp", verifyOtp);
patientRoute.post('/send-otp-uhid', sendOtpByUHID);




export default patientRoute;