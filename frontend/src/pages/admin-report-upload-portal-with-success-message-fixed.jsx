import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../auth/url";
import { useNavigate } from "react-router-dom";
import { GoPencil } from "react-icons/go";
import toast from "react-hot-toast";
import diagnosticList from "../auth/diagTest";
import labList from "../auth/labTest";


const AdminReportUploadPortal = () => {
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [diagnosticSearchTerm, setDiagnosticSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedReport, setSelectedReport] = useState([]);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [currentReportName, setCurrentReportName]= useState("")
  const [file, setFile] = useState(null); // Store the file to be uploaded
  const [singleFileArray, setSingleFileArray]= useState([])
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // const labList = [
  //   "Complete Blood Count",
  //   "Lipid Profile",
  //   "Liver Function Test",
  //   "Kidney Function Test",
  //   "Thyroid Profile",
  //   "HbA1c",
  // ];

  // const diagnosticList = [
  //   "X-Ray",
  //   "MRI",
  //   "CT Scan",
  //   "Ultrasound",
  //   "ECG",
  //   "EEG",
  // ];

  // useEffect(() => {
  //   if (labList.includes(selectedReport)) {
  //     setSelectedReportType("Lab Report");
  //     console.log(selectedReportType)
  //   } else if (diagnosticList.includes(selectedReport)) {
  //     setSelectedReportType("Diagnostic Report");
  //     console.log(selectedReportType)
  //   } else {
  //     setSelectedReportType("");
  //   }
  // }, [selectedReport]);

  useEffect(() => {
    const fetchPatientData = async () => {
      setFetchLoading(true);

      try {
        const response = await axios.get(`${url}/api/v1/auth/patients`);

        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
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
  };

  const handleReportToggle = (reportName) => {
    setSelectedReport(prev => ({
      ...prev,
      [reportName]: !prev[reportName]
    }));
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first selected file

    if (selectedFile) {
      // Push the file and its associated data into the array
      // const reportName = Object.keys(selectedReport)[0]
      console.log(selectedReportType)
      console.log("ye leeeeee",currentReportName)
      setSingleFileArray((prevData) => [
        ...prevData,
        {
          reportFile: selectedFile,
          uhidOrNumber: selectedPatient.UHID,
          reportType: selectedReportType,
          reportName: currentReportName
        }
      ]);
    }
    setFile(selectedFile)
  };
  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFile(selectedFile); // Set the selected file
  // };

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
    console.log(singleFileArray)

    setLoading(true);
    try {
      for (let i = 0; i < singleFileArray.length; i++) {
        const fileData = singleFileArray[i];

        const formData = new FormData();
        formData.append("reportFile", fileData.reportFile);
        formData.append("uhidOrNumber", fileData.uhidOrNumber);
        formData.append("reportType", fileData.reportType);
        formData.append("reportName", fileData.reportName);

      // console.log("single", file);

      const response = await axios.post(
        `${url}/api/v1/auth/upload-report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

      // console.log(`Upload response for ${selectedReport}:`, response.data);
      // toast.success("File uploaded ");
      setShowSuccess(true);
      setFile(null);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error uploading report:", err);
      toast.error(err.response.data);
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

    setMultiLoading(true);
    try {
      const formData = new FormData();
      multipleFiles.forEach((file) => {
        formData.append("reports", file);
      });
      formData.append("uhidOrNumber", selectedPatient.UHID);

      const response = await axios.post(
        `${url}/api/v1/auth/upload-multiple-reports`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log(`Upload response for reports:`, response.data);
      // toast.success("File uploaded ");
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
      setMultipleFiles([]);
    } catch (err) {
      setError(err.message);
      toast.error("Something Went Wrong")
      console.error("Error uploading report:", err);
    } finally {
      setMultiLoading(false);
    }
  };

  console.log(error)

  // Filter reports based on the search term
  const filterReports = (reports, searchTerm) => {
   
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    
    
    const filteredReports = reports.filter((report) => {
     
      const normalizedReport = report.trim().toLowerCase();
  
      
      return normalizedReport.includes(normalizedSearchTerm);
    });
  
    
    const uniqueReports = [...new Set(filteredReports)];
  
    
    // console.log('Filtered and Unique Reports:', uniqueReports);
  
    return uniqueReports;
  };
  
  

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
                  <th className="py-3 px-6 text-xs lg:text-base  border-b text-left font-semibold">
                    Name
                  </th>
                  <th className="py-3 px-6 text-xs lg:text-base border-b text-left font-semibold">
                    UHID
                  </th>
                  <th className="py-3 px-6 text-xs lg:text-base border-b text-left font-semibold">
                    Number
                  </th>
                  <th className="py-3 px-6 text-xs lg:text-base border-b text-left font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedPatients.map((patient) => (
                  <tr key={patient.UHID} className="hover:bg-gray-100">
                    <td className="py-3 px-3 text-left lg:text-base text-xs border-b">
                      {patient.name}
                    </td>
                    <td className="py-3 px-3 text-left lg:text-base   text-xs border-b">
                      {patient.UHID}
                    </td>
                    <td className="py-3 px-3 text-left lg:text-base text-xs border-b">
                      {patient.number}
                    </td>
                    <td className="py-3 px-3 text-left  lg:text-base text-xs border-b">
                      <button
                        onClick={() => setSelectedPatient(patient || null)}
                        className="rounded bg-teal-600 text-white py-1 px-4 flex items-center justify-center"
                      >
                        <span className="lg:hidden">
                          <GoPencil />
                        </span>
                        <span className="hidden lg:inline">Manage</span>
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

        {fetchLoading && (
          <div className="pl-6 pd-2">Fetching Patients Details...</div>
        )}

        <form onSubmit={handlePatientSearch}>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Enter UHID or Mobile Number"
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
              className="flex-grow px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {selectedPatient !== "" && (
              <button
                onClick={() => setSelectedPatient("")}
                className="ml-1 px-3 py-2 bg-teal-600 text-white text-sm lg:text-lg rounded-md hover:bg-teal-700 transition-colors duration-150"
              >
                Search Other Patient
              </button>
            )}
          </div>
        </form>

        {selectedPatient && <PatientCard patient={selectedPatient} />}

        {patientSearchTerm && <SearchedPatient />}

        {selectedPatient && (
          <div className="flex justify-center">
            <input
              type="file"
              onChange={handleMultipleFileChange}
              disabled={multiLoading}
              multiple
              className=""
            />
            <button
              onClick={handleMultipleUpload}
              className=" px-1 py-1 text-sm text-white rounded-md shadow-md bg-teal-600 hover:bg-teal-700"
            >
              {multiLoading ? "Uploading..." : "Bulk Upload"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* // lab reports upload */}
          <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
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
                <span className="ml-2">Lab Report</span>
              </h2>
            </div>
            <div className="p-4">
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search Lab Report"
                  value={labSearchTerm}
                  onChange={(e) => setLabSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filterReports(labList, labSearchTerm).map((report) => (
                  
                  <div
                    key={report}
                    className="flex items-center py-2 hover:bg-gray-50 rounded-md transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      id={report}
                      checked={selectedReport[report] || false}
                      onChange={() => {handleReportToggle(report)
                                      setSelectedReportType("Lab Report")
                                      setCurrentReportName(report)}

                      }
                      className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <label
                      htmlFor={report}
                      className="ml-3 flex-grow cursor-pointer"
                    >
                      {report}
                    </label>
                    {selectedReport[report]&& (
                      <div>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                          aria-label={`Upload file for ${report}`}
                        />
                        {file && (
                          <p className="text-sm text-gray-600 mt-2">
                            {/* Selected file: {file.name} */}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
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
                <span className="ml-2">Diagnostic Reports</span>
              </h2>
            </div>
            <div className="p-4">
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search Diagnostic Reports"
                  value={diagnosticSearchTerm}
                  onChange={(e) => setDiagnosticSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filterReports(diagnosticList, diagnosticSearchTerm).map(
                  (report) => (
                    <div
                      key={report}
                      className="flex items-center py-2 hover:bg-gray-50 rounded-md transition-colors duration-150"
                    >
                      <input
                        type="checkbox"
                        id={report}
                        checked={selectedReport[report] || false}
                        onChange={() => {handleReportToggle(report)
                          setSelectedReportType("Diagnostic Report")
                          setCurrentReportName(report)}
                        }
                        className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                      />
                      <label
                        htmlFor={report}
                        className="ml-3 flex-grow cursor-pointer"
                      >
                        {report}
                      </label>
                      {selectedReport[report] && (
                        <div>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            aria-label={`Upload file for ${report}`}
                          />
                          {file && (
                            <p className="text-sm text-gray-600 mt-2">
                              {/* Selected file: {file.name} */}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
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
