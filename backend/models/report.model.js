import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    enum: ["Lab Report", "Diagnostic Report"],
    required: true,
  },
  reportName: {
    type: String,
    enum: [
      "Complete Blood Count",
      "Lipid Profile",
      "Liver Function Test",
      "Kidney Function Test",
      "Thyroid Profile",
      "HbA1c",
      "X-Ray",
      "MRI",
      "CT Scan",
      "Ultrasound",
      "ECG",
      "EEG",
    ],
    // required: true,
  },
  reportLink: {
    type: String,
    required: true,
  },
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
