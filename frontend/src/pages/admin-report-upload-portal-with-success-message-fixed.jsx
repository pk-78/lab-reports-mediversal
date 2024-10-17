import axios from 'axios';
import React, { useEffect, useState } from 'react';
import url from '../auth/url';

const AdminReportUploadPortal = () => {
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [labSearchTerm, setLabSearchTerm] = useState('');
  const [diagnosticSearchTerm, setDiagnosticSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedReports, setSelectedReports] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const allReports = {
    lab: [
      'Complete Blood Count', 'Lipid Profile', 'Liver Function Test', 
      'Kidney Function Test', 'Thyroid Profile', 'HbA1c'
    ],
    diagnostic: [
      'X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG', 'EEG'
    ]
  };


  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/v1/auth/patients`);
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


    const foundPatient = users.find(patient =>
      patient.UHID?.toLowerCase() === searchTerm || patient.number?.toLowerCase() === searchTerm
    );

    if (foundPatient) {
      setSelectedPatient(foundPatient);
    } else {
      setSelectedPatient(null);
    }
  };

  // Toggle report selection
  const handleReportToggle = (reportName) => {
    setSelectedReports(prev => ({
      ...prev,
      [reportName]: !prev[reportName]
    }));
  };

  // Handle report upload
  const handleUpload = () => {
    console.log("Uploading reports:", selectedReports);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
  };

  // Filter reports based on the search term
  const filterReports = (reports, searchTerm) => {
    return reports.filter(report => 
      report.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Render the report section (Lab or Diagnostic)
  const ReportSection = ({ title, reports, searchTerm, setSearchTerm, icon }) => (
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
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filterReports(reports, searchTerm).map((report) => (
            <div key={report} className="flex items-center py-2 hover:bg-gray-50 rounded-md transition-colors duration-150">
              <input
                type="checkbox"
                id={report}
                checked={selectedReports[report] || false}
                onChange={() => handleReportToggle(report)}
                className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor={report} className="ml-3 flex-grow cursor-pointer">{report}</label>
              {selectedReports[report] && (
                <input 
                  type="file" 
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  aria-label={`Upload file for ${report}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PatientCard = ({ patient }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-medium">{patient ? patient.name : 'Not selected'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">UHID</p>
          <p className="font-medium">{patient ? patient.UHID : 'Not selected'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Mobile Number</p>
          <p className="font-medium">{patient ? patient.number : 'Not selected'}</p>
        </div>
      </div>
    </div>
  );

  const SuccessMessage = () => (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center">
      <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Reports uploaded successfully!
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
          <h1 className="text-3xl font-bold text-white">Upload Patient Reports</h1>
        </div>
        <div className="p-6">
          <form onSubmit={handlePatientSearch} className="mb-8">
            <label htmlFor="patient-search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Patient by UHID or Mobile Number
            </label>
            <div className="flex items-center">
              <input
                id="patient-search"
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                type="text"
                value={patientSearchTerm}
                onChange={(e) => setPatientSearchTerm(e.target.value)}
                placeholder="Enter UHID or Mobile Number"
              />
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-r-md transition duration-150 ease-in-out flex items-center justify-center"
                aria-label="Search for patient"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {selectedPatient && <PatientCard patient={selectedPatient} />}

          <ReportSection
            title="Lab Reports"
            reports={allReports.lab}
            searchTerm={labSearchTerm}
            setSearchTerm={setLabSearchTerm}
            icon={
              <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h6l3 8 4-16 3 8h6" />
              </svg>
            }
          />
          <ReportSection
            title="Diagnostic Reports"
            reports={allReports.diagnostic}
            searchTerm={diagnosticSearchTerm}
            setSearchTerm={setDiagnosticSearchTerm}
            icon={
              <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            }
          />
          <div className="text-right mt-6">
            <button
              onClick={handleUpload}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
            >
              Upload Selected Reports
            </button>
          </div>
        </div>
      </div>
      {showSuccess && <SuccessMessage />}
    </div>
  );
};

export default AdminReportUploadPortal;
