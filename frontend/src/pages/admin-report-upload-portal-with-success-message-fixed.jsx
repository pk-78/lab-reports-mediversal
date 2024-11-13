import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../auth/url";
import { useNavigate } from "react-router-dom";

const AdminReportUploadPortal = () => {
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [diagnosticSearchTerm, setDiagnosticSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedReport, setSelectedReport] = useState(""); // Store only one report type
  const [selectedReportType, setSelectedReportType] = useState(""); // Use useState to declare this
  const [file, setFile] = useState(null); // Store the file to be uploaded
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const labReports = [
    "Complete Blood Count",
    "Lipid Profile",
    "Liver Function Test",
    "Kidney Function Test",
    "Thyroid Profile",
    "HbA1c",
  ];

  const diagnosticReports = [
    "X-Ray",
    "MRI",
    "CT Scan",
    "Ultrasound",
    "ECG",
    "EEG",
  ];

  // Set selected report type based on selected report
  useEffect(() => {
    if (labReports.includes(selectedReport)) {
      setSelectedReportType("Lab Report");
    } else if (diagnosticReports.includes(selectedReport)) {
      setSelectedReportType("Diagnostic Report");
    } else {
      setSelectedReportType(""); // Handle case where the report is not found
    }
  }, [selectedReport]);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`${url}/api/v1/auth/patients`);
        // console.log("fetching");
        // console.log(response);
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const handlePatientSearch = (e) => {
    e.preventDefault();
    const searchTerm = patientSearchTerm.toLowerCase();

    const foundPatient = users.find(
      (patient) =>
        patient.UHID?.toLowerCase() === searchTerm ||
        patient.number?.toLowerCase() === "+91" + searchTerm
    );

    // setSelectedPatient(foundPatient || null);
  };

  // Toggle report selection
  const handleReportToggle = (reportName) => {
    setSelectedReport((prev) => (prev === reportName ? "" : reportName));
    setFile(null); // Reset file when toggling report
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Set the selected file
  };

  // Handle report upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (!selectedPatient || !selectedReport) {
      alert("Please select a patient and report type before uploading.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("reportFile", file); // Multer expects this field to be 'file'
      formData.append("uhidOrNumber", selectedPatient.number); // Append patient number/UHID
      formData.append("reportType", selectedReportType);
      formData.append("reportName", selectedReport);
      console.log(formData);

      // Make an axios call to upload the file and metadata
      const response = await axios.post(
        `${url}/api/v1/auth/upload-report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`Upload response for ${selectedReport}:`, response.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error uploading report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleUpload = async (e) => {
    e.preventDefault();

    if (multipleFiles.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    if (!selectedPatient) {
      alert("Please select a patient before uploading.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      multipleFiles.forEach((file) => {
        formData.append("reports", file); // Append each file individually
      });
      formData.append("uhidOrNumber", selectedPatient.number); // Append patient number/UHID

      const response = await axios.post(
        `${url}/api/v1/auth/upload-multiple-reports`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`Upload response for reports:`, response.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setMultipleFiles([]);
    } catch (err) {
      setError(err.message);
      console.error("Error uploading report:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter reports based on the search term
  const filterReports = (reports, searchTerm) => {
    return reports.filter((report) =>
      report.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const ReportSection = ({
    title,
    reports,
    searchTerm,
    setSearchTerm,
    icon,
  }) => (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
      </div>
      <div className="p-4">
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder={`Search ${title}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filterReports(reports, searchTerm).map((report) => (
            <div
              key={report}
              className="flex items-center py-2 hover:bg-gray-50 rounded-md transition-colors duration-150"
            >
              <input
                type="checkbox"
                id={report}
                checked={selectedReport === report}
                onChange={() => handleReportToggle(report)}
                className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor={report} className="ml-3 flex-grow cursor-pointer">
                {report}
              </label>
              {selectedReport === report && (
                <div>
                  <input
                    type="file"
                    onChange={handleFileChange} // Handle file selection
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    aria-label={`Upload file for ${report}`}
                  />
                  {file && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PatientCard = ({ patient }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Patient Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-medium">
            {patient ? patient.name : "Not selected"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">UHID</p>
          <p className="font-medium">
            {patient ? patient.UHID : "Not selected"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Mobile Number</p>
          <p className="font-medium">
            {patient ? patient.number : "Not selected"}
          </p>
        </div>
      </div>
    </div>
  );

  const SearchedPatient = () => {
    if (selectedPatient !== "") return null;

    // Filter patients based on the search term
    const filteredPatients = users.filter(
      (patient) =>
        patient.UHID?.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.number?.toLowerCase().includes(patientSearchTerm.toLowerCase())
    );

    // Limit the display to the first 10 patients
    const displayedPatients = filteredPatients.slice(0, 10);

    return (
      <div className="my-4">
        {filteredPatients.length > 0 ? (
          <>
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
              <thead>
                <tr className="text-left">
                  <th className="py-3 px-6 border-b text-left font-semibold">
                    Name
                  </th>
                  <th className="py-3 px-6 border-b text-left font-semibold">
                    UHID
                  </th>
                  <th className="py-3 px-6 border-b text-left font-semibold">
                    Number
                  </th>
                  <th className="py-3 px-6 border-b text-left font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedPatients.map((patient) => (
                  <tr key={patient.UHID} className="hover:bg-gray-100">
                    <td className="py-3 px-6 text-left border-b">
                      {patient.name}
                    </td>
                    <td className="py-3 px-6 text-left border-b">
                      {patient.UHID}
                    </td>
                    <td className="py-3 px-6 text-left border-b">
                      {patient.number}
                    </td>
                    <td className="py-3 px-6 text-left border-b">
                      <button
                        onClick={() => setSelectedPatient(patient || null)}
                        className="rounded bg-teal-600 text-white py-1 px-4"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length > 10 && (
              <p className="text-gray-500 mt-2">
                Showing 10 of {filteredPatients.length} matching patients.
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500">No matching patients found</p>
        )}
      </div>
    );
  };

  const SuccessMessage = () => (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center">
      <svg
        className="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      Reports uploaded successfully!
    </div>
  );
  const handleMultipleFileChange = (e) => {
    const filesArray = Array.from(e.target.files); // Convert FileList to an array
    setMultipleFiles(filesArray);
  };

  return (
    <div className="relative  ">
      <button
        onClick={() => {
          localStorage.removeItem("userData");
          localStorage.removeItem("role");
          navigate("/");
        }}
        className=" absolute top-2 right-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 focus:outline-none  focus:ring-teal-500"
      >
        Logout
      </button>
      <div className="bg-white px-2  shadow-md">
        <div className="bg-gradient-to-r mb-6 from-teal-500 to-teal-600 p-6">
          <h1 className="text-3xl  font-bold text-white">
            Upload Patient Reports
          </h1>
        </div>

        {loading && (
          <div className="pl-6 pd-2">Fetching Patients Details...</div>
        )}

        <form onSubmit={handlePatientSearch}>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Enter UHID or Mobile Number"
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {selectedPatient !== "" && (
              <button
                onClick={() => setSelectedPatient("")}
                className="ml-4 px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-150"
              >
                Search Other Patient
              </button>
            )}
          </div>
        </form>

        {selectedPatient && <PatientCard patient={selectedPatient} />}

        {patientSearchTerm && <SearchedPatient />}

        {selectedPatient && (
          <div className="flex justify-end">
            <input
              type="file"
              onChange={handleMultipleFileChange}
              disabled={loading}
              multiple
              className=""
            />
            <button
              onClick={handleMultipleUpload}
              className=" px-6 py-3 text-white rounded-md shadow-md bg-teal-600 hover:bg-teal-700"
            >
              {loading ? "Uploading..." : "Bulk Upload"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ReportSection
            title="Lab Reports"
            reports={labReports}
            searchTerm={labSearchTerm}
            setSearchTerm={setLabSearchTerm}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12l-3-3m0 0l-3 3m3-3v12m6-12h3M9 12H6m12 0h3M6 21h12"
                />
              </svg>
            }
          />
          <ReportSection
            title="Diagnostic Reports"
            reports={diagnosticReports}
            searchTerm={diagnosticSearchTerm}
            setSearchTerm={setDiagnosticSearchTerm}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6h6v13"
                />
              </svg>
            }
          />
        </div>

        {selectedPatient && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`px-6 py-3 text-white rounded-md shadow-md ${
                loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
              } transition-colors duration-150`}
            >
              {loading ? "Uploading..." : "Upload Reports"}
            </button>
          </div>
        )}

        {showSuccess && <SuccessMessage />}
        {error && (
          <div className="text-red-500 mt-4">An error occurred: {error}</div>
        )}
      </div>
    </div>
  );
};

export default AdminReportUploadPortal;
