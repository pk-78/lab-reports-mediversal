import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import twilio from "twilio";
import Patient from "../models/patient.model.js";
import Report from "../models/report.model.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

import axios from "axios";

import csvParser from "csv-parser";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/; // E.164 format regex
  return phoneRegex.test(phoneNumber);
};
// Send OTP From twillio filhal k liye working stop hai iski

// send otp from way2mint  workin for now
export const sendWay2mintOtp = async (req, res) => {
  try {
    const { number } = req.body;
    // console.log("number", number);
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
      console.log("Patient does not exist");
      return res.status(400).json({ message: "Patient does not exist" });
    }

    // Generate OTP
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Set OTP expiration time (10 minutes from now)
    const otpExpire = Date.now() + 10 * 60 * 1000;

    // Save OTP and expiration to the patient document
    patient.otp = otp;
    patient.otpExpire = otpExpire;
    await patient.save();

    // Send OTP via Way2Mint SMS using GET request with query parameters
    try {
      const way2MintResponse = await axios.get(
        `https://apibulksms.way2mint.com/pushsms?username=${process.env.WAY2MINT_USER}&password=${process.env.WAY2MINT_PASSWORD}&tmplId=1707173459164626895&to=${number}&from=MDVRSL&text=Your Mediversal Patient Portal OTP is ${otp}. Use it within 10 mins to log in. Do not share this code. - Team Mediversal.&data4=1201159335359924573,1702173216915572636`
      );
      // console.log(way2MintResponse);

      // Check if the response is successful
      if (way2MintResponse.status === 200) {
        res.status(200).json({ message: "OTP sent successfully", number });
      } else {
        res.status(500).json({
          error: "Failed to send OTP through Way2Mint",
          details: way2MintResponse.data.message,
        });
      }
    } catch (error) {
      console.error("Way2Mint API error:", error); // Log Way2Mint error details
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
export const sendWay2mintOtpByUhid = async (req, res) => {
  try {
    const { uhid } = req.body;

    let patient = await Patient.findOne({ UHID: uhid });
    if (!patient) {
      console.log("Patient does not exist");
      return res.status(400).json({ message: "Patient does not exist" });
    }
    if (!patient.number) {
      return res.status(404).json({ message: "Number not found" });
    }
    // console.log(patient.number);

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const otpExpire = Date.now() + 10 * 60 * 1000;

    patient.otp = otp;
    patient.otpExpire = otpExpire;
    await patient.save();

    try {
      const way2MintResponse = await axios.get(
        `https://apibulksms.way2mint.com/pushsms?username=${process.env.WAY2MINT_USER}&password=${process.env.WAY2MINT_PASSWORD}&tmplId=1707173459164626895&to=${patient.number}&from=MDVRSL&text=Your Mediversal Patient Portal OTP is ${otp}. Use it within 10 mins to log in. Do not share this code. - Team Mediversal.&data4=1201159335359924573,1702173216915572636`
      );
      // console.log(way2MintResponse);

      // Check if the response is successful
      if (way2MintResponse.status === 200) {
        res
          .status(200)
          .json({ message: "OTP sent successfully", number: patient.number });
      } else {
        res.status(500).json({
          error: "Failed to send OTP through Way2Mint",
          details: way2MintResponse.data.message,
        });
      }
    } catch (error) {
      console.error("Way2Mint API error:", error); // Log Way2Mint error details
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

    await Patient.updateMany(
      { number },
      { $unset: { otp: "", otpExpire: "" } }
    );

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
  // console.log("ye le", token);

  patient.otp = undefined;
  patient.otpExpire = undefined;
  const id = patient._id;
  await patient.save();

  res.status(200).json({ message: "OTP verified successfully", token, id });
};

// Send OTP by UHID


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
  const { uhidOrNumber, reportType, reportName, uploaderName } = req.body;

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

        const report = new Report({
          uploaderName,
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
  const { uhidOrNumber, uploaderName } = req.body;

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

    // Save each uploaded file as a report
    const reports = await Promise.all(
      req.files.map(async (file) => {
        const reportLink = `${req.protocol}://${req.get("host")}/reports/${
          file.filename
        }`;

        const report = new Report({
          uploaderName: uploaderName,
          reportType: req.body.reportType,
          reportName: req.body.reportName,
          reportLink,
        });

        await report.save();
        patient.reports.push(report._id);
        return report;
      })
    );

    // Save updated patient
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

export const downloadFile = async (req, res) => {
  const fileUrl = req.query.url;
  // console.log("Received file URL:", fileUrl);

  try {
    const response = await axios.get(fileUrl, { responseType: "stream" });

    // console.log("Response headers:", response.headers);

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileUrl.split("/").pop()}`
    );

    response.data.pipe(res);
  } catch (error) {
    console.error("Error in downloadFile controller:", error.message);
    res.status(500).send("Error downloading file");
  }
};

//csv file uploads

// Bulk upload controller
export const bulkUploadPatients = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path; // Path to the uploaded CSV file
  const patientsData = [];

  // Read and parse the CSV file
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      // Each row represents a patient record
      patientsData.push(row);
    })
    .on("end", async () => {
      try {
        // Validate and save patients to database
        const bulkOps = patientsData.map((data) => ({
          updateOne: {
            filter: { UHID: data.UHID }, // Use a unique field like UHID to prevent duplication
            update: { $set: data },
            upsert: true, // Insert if the record does not exist
          },
        }));

        await Patient.bulkWrite(bulkOps);

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({
          message: "Patients uploaded successfully",
          patients: patientsData,
        });
      } catch (error) {
        console.error("Error saving patients:", error);
        res
          .status(500)
          .json({ message: "Error saving patients", error: error.message });
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res
        .status(500)
        .json({ message: "Error reading CSV file", error: error.message });
    });
};

export const fetchReportsWithCount = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch reports uploaded today and group by uploaderName
    const reports = await Report.aggregate([
      {
        // Match reports that were created today
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        // Group by uploaderName and count the reports
        $group: {
          _id: "$uploaderName", // Group by uploader's name
          count: { $sum: 1 }, // Count the number of reports
        },
      },
      {
        // Optionally, sort the results by uploaderName (optional)
        $sort: { _id: 1 },
      },
    ]);

    // Return the result as JSON with uploaderName and upload count
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).send("Error fetching reports");
  }
};

export const fetchReportsCountLast15Days = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - 15));

    // Fetch reports uploaded in the last 15 days, grouped by day and uploader
    const reports = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }, // Filter reports created in the last 15 days
        },
      },
      {
        $group: {
          _id: {
            uploaderName: "$uploaderName",
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
          count: { $sum: 1 }, // Count the number of reports for each uploader and day
        },
      },
      {
        $group: {
          _id: "$_id.uploaderName",
          dailyCounts: {
            $push: {
              date: "$_id.date",
              count: "$count",
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by uploaderName (optional)
      },
    ]);

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports count:", error);
    res
      .status(500)
      .json({ message: "Error fetching reports count", error: error.message });
  }
};
