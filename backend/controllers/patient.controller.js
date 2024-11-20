import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import twilio from "twilio";
import Patient from "../models/patient.model.js";
import Report from "../models/report.model.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/; // E.164 format regex
  return phoneRegex.test(phoneNumber);
};
// Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { number } = req.body;

    // Validate phone number format
    if (!isValidPhoneNumber(number)) {
      return res.status(400).json({
        message:
          "Invalid phone number format. Please use international format (e.g., +1234567890).",
      });
    }

    // Check if patient already exists or create a new entry
    let patient = await Patient.findOne({ number });
    if (!patient) {
      patient = new Patient({ number });
    }

    // Generate OTP
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Set OTP expiration time (5 minutes from now)
    const otpExpire = Date.now() + 5 * 60 * 1000;

    // Save OTP and expiration to the patient document
    patient.otp = otp;
    patient.otpExpire = otpExpire;
    await patient.save();

    // Send OTP via Twilio SMS
    try {
      await client.messages.create({
        body: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        from: twilioPhoneNumber,
        to: number,
      });

      res.status(200).json({ message: "OTP sent successfully", number });
    } catch (error) {
      console.error("Twilio error:", error); // Log Twilio error details
      res
        .status(500)
        .json({ error: "Failed to send OTP", details: error.message });
    }
  } catch (error) {
    console.error("Server error:", error); // Log server error details
    res.status(500).json({
      error: "An error occurred on the server",
      details: error.message,
    });
  }
};

// Verify OTP by number
export const verifyOtp = async (req, res) => {
  const { number, otp } = req.body;

  try {
    // Find all patients associated with the given number
    const patients = await Patient.find({ number });

    if (!patients.length) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Verify OTP against the first patient's record (assuming OTP applies to all)
    const primaryPatient = patients[0];

    if (primaryPatient.otp !== otp || primaryPatient.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: primaryPatient._id, number: primaryPatient.number },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Generated Token:", token); // Debugging: Check token generation

    // Clear OTP and expiration for all patients with the same number
    await Patient.updateMany(
      { number },
      { $unset: { otp: "", otpExpire: "" } }
    );

    // Extract UHIDs along with _id for all associated patients
    const uhidList = patients.map((p) => ({
      _id: p._id,
      UHID: p.UHID,
    }));

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      uhidList,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// verify otp by UHID
export const verifyOtpByUhid = async (req, res) => {
  const { UHID, otp } = req.body;

  const patient = await Patient.findOne({ UHID });
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  if (patient.otp !== otp || patient.otpExpire < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const token = jwt.sign(
    { id: patient._id, number: patient.number },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  console.log("ye le", token);

  patient.otp = undefined;
  patient.otpExpire = undefined;
  const id = patient._id;
  await patient.save();

  res.status(200).json({ message: "OTP verified successfully", token, id });
};

// Send OTP by UHID
export const sendOtpByUHID = async (req, res) => {
  const { uhid } = req.body;

  let patient = await Patient.findOne({ UHID: uhid });
  if (!patient) {
    return res
      .status(404)
      .json({ message: "Patient with this UHID not found" });
  }

  if (!patient.number) {
    return res
      .status(400)
      .json({ message: "No phone number associated with this patient" });
  }

  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otpExpire = Date.now() + 5 * 60 * 1000;

  patient.otp = otp;
  patient.otpExpire = otpExpire;
  await patient.save();

  // Send OTP via SMS using Twilio
  try {
    await client.messages.create({
      body: ` Your OTP code is ${otp}. It will expire in 5 minutes.`,
      from: twilioPhoneNumber,
      to: patient.number,
    });

    res.status(200).json({
      message: "OTP sent successfully to registered phone number",
      number: patient.number,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
};

export const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patient", error: error.message });
  }
};

export const registerPatient = async (req, res) => {
  const { name, number, UHID } = req.body;

  try {
    let patient = await Patient.findOne({ $or: [{ UHID }] });
    if (patient) {
      return res
        .status(400)
        .json({ message: "Patient with this number or UHID already exists" });
    }

    patient = new Patient({ name, number, UHID });
    await patient.save();

    res
      .status(201)
      .json({ message: "Patient registered successfully", patient });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering patient", error: error.message });
  }
};

//repoet protuios
//upload report
export const uploadReport = async (req, res) => {
  const { uhidOrNumber, reportType, reportName } = req.body;

  try {
    const patient = await Patient.findOne({
      $or: [{ UHID: uhidOrNumber }, { number: uhidOrNumber }],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Process each uploaded file
    const reports = await Promise.all(
      req.files.map(async (file) => {
        const reportLink = `${req.protocol}://${req.get("host")}/reports/${
          file.filename
        }`;

        // const reportLink = ${req.protocol}://${req.get("host")}/reports/${file.filename};
        const report = new Report({
          reportType,
          reportName,
          reportLink, // Save file URL in MongoDB
        });

        await report.save();
        patient.reports.push(report);
        return report;
      })
    );

    await patient.save();

    res.status(201).json({ message: "Reports uploaded successfully", reports });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error uploading reports", error: error.message });
  }
};

export const getPatientReports = async (req, res) => {
  const { id } = req.params; // Use 'id' from request parameters

  try {
    // Find patient by ID
    const patient = await Patient.findById(id).populate("reports");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Mapping over reports to return structured data
    const reports = patient.reports.map((report) => ({
      reportType: report.reportType,
      reportName: report.reportName,
      reportLink: report.reportLink,
      status: report.status,
      date: report.createdAt,
    }));

    // Return patient and their reports
    res.status(200).json({ patient, reports });
  } catch (error) {
    // Handle error during the process
    res.status(500).json({
      message: "Error fetching patient reports",
      error: error.message,
    });
  }
};

export const uploadMultipleReports = async (req, res) => {
  const { uhidOrNumber } = req.body;

  try {
    // Find the patient by UHID or number
    const patient = await Patient.findOne({
      $or: [{ UHID: uhidOrNumber }, { number: uhidOrNumber }],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Loop through each uploaded file and save it as a report link
    const reports = await Promise.all(
      req.files.map(async (file) => {
        const reportLink = `${req.protocol}://${req.get("host")}/reports/${
          file.filename
        }`;

        const report = new Report({
          reportLink, // store file link
        });
        await report.save();
        patient.reports.push(report);
        return report;
      })
    );

    await patient.save();

    res.status(201).json({ message: "Reports uploaded successfully", reports });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading reports", error: error.message });
  }
};

// get uhid by number
export const getUHIDsByNumber = async (req, res) => {
  const { number } = req.body;

  try {
    // Find all patients with the given phone number
    const patients = await Patient.find({ number });

    if (!patients || patients.length === 0) {
      return res
        .status(404)
        .json({ message: "No UHIDs found for this number" });
    }

    // Extract UHIDs from the matched patients
    const uhidList = patients.map((patient) => patient.UHID);

    res.status(200).json({ message: "UHIDs retrieved successfully", uhidList });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving UHIDs",
      error: error.message,
    });
  }
};
