import React, { useState } from 'react';

const AdminReportUploadPortal = () => {
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [labSearchTerm, setLabSearchTerm] = useState('');
  const [diagnosticSearchTerm, setDiagnosticSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedReports, setSelectedReports] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // This would be fetched from the backend in a real application
  const allReports = {
    lab: [
      'Complete Blood Count', 'Lipid Profile', 'Liver Function Test', 
      'Kidney Function Test', 'Thyroid Profile', 'HbA1c'
    ],
    diagnostic: [
      'X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG', 'EEG'
    ]
  };

  const handlePatientSearch = (e) => {
    e.preventDefault();
    // Simulating a patient search
    setSelectedPatient({
      name: "John Doe",
      uhid: "UHID001",
      mobile: "9876543210"
    });
  };

  const handleReportToggle = (reportName) => {
    setSelectedReports(prev => ({
      ...prev,
      [reportName]: !prev[reportName]
    }));
  };

  const handleUpload = () => {
    console.log("Uploading reports:", selectedReports);
    // In a real app, this would trigger an upload API call
    // For now, we'll just show the success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
  };

  const filterReports = (reports, searchTerm) => {
    return reports.filter(report => 
      report.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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
          <p className="font-medium">{patient ? patient.uhid : 'Not selected'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Mobile Number</p>
          <p className="font-medium">{patient ? patient.mobile : 'Not selected'}</p>
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

          <PatientCard patient={selectedPatient} />

          <ReportSection 
            title="Lab Reports" 
            reports={allReports.lab} 
            searchTerm={labSearchTerm}
            setSearchTerm={setLabSearchTerm}
            icon={<svg className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>}
          />
          <ReportSection 
            title="Diagnostic Reports" 
            reports={allReports.diagnostic}
            searchTerm={diagnosticSearchTerm}
            setSearchTerm={setDiagnosticSearchTerm}
            icon={<svg className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>}
          />

          <button
            onClick={handleUpload}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center justify-center"
            aria-label="Upload selected reports"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Selected Reports
          </button>
        </div>
      </div>
      {showSuccess && <SuccessMessage />}
    </div>
  );
};

export default AdminReportUploadPortal;
