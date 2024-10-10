import express from "express"
import { sendOtp, verifyOtp } from "../controllers/patient.controller.js"


const patientRoute = express.Router()


patientRoute.post("/sendOtp",sendOtp)
patientRoute.post("/verify-otp", verifyOtp);



export default patientRoute;