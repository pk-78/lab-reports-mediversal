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
  const [currentReportName, setCurrentReportName] = useState("");
  const [file, setFile] = useState(null); // Store the file to be uploaded
  const [singleFileArray, setSingleFileArray] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [multiLoading, setMultiLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const [uploadedReports, setUploadedReports] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [disabledReports, setDisabledReports] = useState({});
  const [showFileForReport, setShowFileForReport] = useState({});
  const [toShowFile, setToShowFile] = useState("");
  const [previewReport, setPreviewReport] = useState(null);
  const [previewName, setPreviewName] = useState(null);
  let reportType;

  const navigate = useNavigate();
  const fileArray = [];

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
    setSelectedReport((prev) => {
      const isCurrentlySelected = prev[reportName];

      if (isCurrentlySelected) {
        // If the checkbox is being unchecked, remove the file
        setSingleFileArray((prevData) =>
          prevData.filter((fileData) => fileData.reportName !== reportName)
        );
      }

      return {
        ...prev,
        [reportName]: !isCurrentlySelected,
      };
    });

    setDisabledReports((prev) => ({
      ...prev,
      [reportName]: false,
    }));

    setShowFileForReport((prev) => ({
      ...prev,
      [reportName]: false,
    }));

    // Optionally reset `file` if it matches the current report
    setFile((prevFile) =>
      prevFile?.reportName === reportName ? null : prevFile
    );
  };

  const handleFileChange = (e, reportName, reportType) => {
    const selectedFile = e.target.files[0]; // Get the first selected file
    // console.log(reportName);
    // console.log(reportType);

    if (selectedFile) {
     

      setSingleFileArray((prevData) => {
        // Check if the file for the current report name already exists
        const updatedData = prevData.filter(
          (fileData) => fileData.reportName !== reportName
        );

        // Add the new file to the array
        return [
          ...updatedData,
          {
            reportFile: selectedFile,
            reportType: reportType,
            reportName: reportName,
          },
        ];
      });
    }
    setFile(selectedFile);
    // console.log(singleFileArray);

    setShowFileForReport((prev) => ({
      ...prev,
      [reportName]: true,
    }));

    // console.log("ye hai report", singleFileArray);
  };
  

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
    // console.log(singleFileArray)

    setLoading(true);
    try {
      for (let i = 0; i < singleFileArray.length; i++) {
        const fileData = singleFileArray[i];

      

        const formData = new FormData();
        formData.append("reportFile", fileData.reportFile);
        formData.append("uhidOrNumber", selectedPatient.UHID);
        formData.append("reportType", fileData.reportType);
        formData.append("reportName", fileData.reportName);


        const response = await axios.post(
          `${url}/api/v1/auth/upload-report`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setDisabledReports((prev) => ({
          ...prev,
          [fileData.reportName]: true, // Mark the report as disabled
        }));

        setSelectedReport((prev) => ({
          ...prev,
          [fileData.reportName]: false,
        })); //uncheck the checkbox
      }

      // console.log(`Upload response for ${selectedReport}:`, response.data);
      // toast.success("File uploaded ");
      setShowSuccess(true);
      setFile(null);
      setSingleFileArray([]);
      setShowFile(false);
      // console.log("ye h", uploadedReports);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error uploading report:", err);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
    // console.log(fileArray);
    setIsDisabled(true);
  };

  const handleSingleUpload = async (e, file, report, type) => {
   
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (!selectedPatient || !selectedReport) {
      alert("Please select a patient and report type before uploading.");
      return;
    }
    // console.log(singleFileArray)

    setSingleLoading(true);
    try {
      const formData = new FormData();
      formData.append("reportFile", file);
      formData.append("uhidOrNumber", selectedPatient.UHID);
      formData.append("reportType", type);
      formData.append("reportName", report);

      const response = await axios.post(
        `${url}/api/v1/auth/upload-report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // removeReport(report)
      // setSingleFileArray((prevData) => {
      //   // Filter out the object where fileData.reportName === reportNameToRemove
      //   return prevData.filter(fileData => fileData.reportName !== report);
      // });
      setDisabledReports((prev) => ({
        ...prev,
        [report]: true,
      }));

      setSelectedReport((prev) => ({
        ...prev,
        [report]: false,
      }));

      setShowSuccess(true);
      // setFile(null);
      // setSingleFileArray([]);
      setShowFile(false);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error uploading report:", err);
      toast.error("Something Went Wrong");
    } finally {
      setSingleLoading(false);
    }
    // console.log(fileArray);
    setIsDisabled(true);
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
      toast.error("Something Went Wrong");
      console.error("Error uploading report:", err);
    } finally {
      setMultiLoading(false);
    }
  };

  // console.log(error)

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

  const removeReport = (reportToRemove) => {
    if (Array.isArray(selectedReport)) {
      // Handle as an array
      const updatedReports = selectedReport.filter(
        (report) => report !== reportToRemove
      );
      setSelectedReport(updatedReports);
    } else if (typeof selectedReport === "string") {
      // Handle as a single string
      if (selectedReport === reportToRemove) {
        setSelectedReport([]); // Reset to empty array if it matches
      } else {
        console.error("The report does not match the selectedReport string.");
      }
    } else if (typeof selectedReport === "object" && selectedReport !== null) {
      // Handle as an object
      const updatedObject = { ...selectedReport };
      if (reportToRemove in updatedObject) {
        delete updatedObject[reportToRemove]; // Remove the key from the object
      }
      // Convert to array if it becomes empty, or keep as object
      setSelectedReport(
        Object.keys(updatedObject).length > 0 ? updatedObject : []
      );
    } else {
      // Handle unexpected cases
      console.error(
        "selectedReport is neither an array, string, nor a valid object:",
        selectedReport
      );
    }
    // setSingleFileArray((prevData) => {
    //   // Filter out the object where fileData.reportName === reportNameToRemove
    //   return prevData.filter(fileData => fileData.reportName !== reportToRemove);
    // });
  };

  const OpenReport = ({ file, report, type }) => {
    let fileData;

    for (let i = 0; i < singleFileArray.length; i++) {
      fileData = singleFileArray[i];

      if (fileData.reportName === report) {
        // console.log("ye le", fileData.reportFile.name);
        setPreviewName(fileData.reportFile.name);
        const reader = new FileReader();

        if (fileData.reportFile.type === "application/pdf") {
          // For PDF files
          reader.onload = () => {
            setPreview(reader.result); // Set the file URL
          };
          reader.readAsDataURL(fileData.reportFile); // Read PDF as Data URL
        } else if (fileData.reportFile.type.startsWith("image/")) {
          // For Image files
          reader.onload = () => {
            setPreview(reader.result); // Set the file URL
          };
          reader.readAsDataURL(fileData.reportFile); // Read Image as Data URL
        } else {
          setPreview(null);
          alert("Unsupported file type. Please upload an image or a PDF.");
        }
      }
    }

    // console.log("ye hai report", singleFileArray);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold text-teal-800 mb-2">
              Confirm Uploaded Reports
            </h2>
            <div
              className="text-black font-bold hover:cursor-pointer"
              onClick={() => setShowFile(false)}
            >
              ╳
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 border border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500 text-sm">
              <p className="text-teal-600">{previewName}</p>
            </div>
            <div className="flex-1 border border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500 text-sm">
              {showFile && (
                <div>
                  {file?.type === "application/pdf" ? (
                    <iframe
                      src={preview}
                      title="PDF Preview"
                      className="w-full h-64 border border-gray-300 rounded-lg"
                    ></iframe>
                  ) : file?.type.startsWith("image/") ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <div>Unsupported File Format</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            {/* <button onClick={() => setShowFile(false)} className="border-teal-700 border-2 text-teal-800 hover:bg-teal-50 px-2 py-1 rounded">
              Close
            </button> */}

            <button
              onClick={() =>
                // handleReportToggle(report)
                {
                  // removeReport(report);
                  handleReportToggle(report);
                  setShowFile(false);
                }
              }
              disabled={loading}
              className={`border-teal-700 rounded border-2 text-teal-800 hover:bg-teal-50 px-2 py-1 ${
                loading ? "text-gray-400" : "text-teal-800"
              } `}
            >
              Remove This File
            </button>
            {/* <button
              onClick={(e) => {
                handleSingleUpload(e, file, report, type);
                // removeReport(report);
              }}
              disabled={loading}
              className={`px-6 py-3 text-white rounded-md shadow-md ${
                loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
              } transition-colors duration-150`}
            >
              {singleLoading ? "Uploading..." : "Confirm Upload"}
            </button> */}
          </div>
        </div>
      </div>
    );
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
                onClick={() => {
                  setSelectedPatient("");
                  setDisabledReports([]);
                }}
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
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
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
                      // disabled={disabledReports[report]}
                      onChange={() => {
                        handleReportToggle(report);
                        setSelectedReportType("Lab Report");
                        setCurrentReportName(report);
                      }}
                      className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <label
                      htmlFor={report}
                      className="ml-3 flex-grow cursor-pointer"
                    >
                      {report}
                    </label>

                    {selectedReport[report] && !disabledReports[report] && (
                      <div>
                        <div className="flex">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                report,
                                (reportType = "Lab Report")
                              )
                            }
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            aria-label={`Upload file for ${report}`}
                          />
                        </div>

                        {file && showFileForReport[report] && (
                          <button
                            onClick={() => {
                              // setShowFileForReport((prev) => ({
                              //   ...prev,
                              //   [report]: true,
                              // }));
                              setPreviewReport(report);
                              setShowFile(true);
                            }}
                            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white rounded p-2"
                          >
                            Preview & Confirm Uploads
                          </button>
                        )}
                        {showFile && previewReport === report && (
                          <OpenReport
                            file={file}
                            report={report}
                            type="Lab Report"
                            // selectedReport={selectedReport[report]}
                          />
                        )}
                      </div>
                    )}
                    {disabledReports[report] && (
                      <span className="ml-3 text-teal-500">Uploaded</span>
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
                        onChange={() => {
                          handleReportToggle(report);
                          setSelectedReportType("Diagnostic Report");
                          setCurrentReportName(report);
                        }}
                        className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                      />
                      <label
                        htmlFor={report}
                        className="ml-3 flex-grow cursor-pointer"
                      >
                        {report}
                      </label>
                      {selectedReport[report] && !disabledReports[report] && (
                        <div>
                          <input
                            type="file"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                report,
                                (reportType = "Diagnostic Report")
                              )
                            }
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            aria-label={`Upload file for ${report}`}
                          />
                          {file && (
                            <p className="text-sm text-gray-600 mt-2">
                              {/* Selected file: {file.name} */}
                            </p>
                          )}
                          {file && showFileForReport[report] && (
                            <button
                              onClick={() => {
                                // setShowFileForReport((prev) => ({
                                //   ...prev,
                                //   [report]: true,
                                // }));
                                setPreviewReport(report);
                                setShowFile(true);
                              }}
                              // disabled={loading}
                              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white rounded p-2"
                            >
                              Preview & Confirm Uploads
                            </button>
                          )}
                          {showFile && previewReport === report && (
                            <OpenReport
                              file={file}
                              report={report}
                              type="Diagnostic Report"
                            />
                          )}
                        </div>
                      )}
                      {disabledReports[report] && (
                        <span className="ml-3 text-teal-500">Uploaded</span>
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
