import React, { useState } from 'react';

const samplePatient = {
  name: "Aarav Patel",
  uhi: "11-1111-1111-1111",
  mobileNumber: "+91 98765 43210"
};

const sampleLabReports = [
  { id: 'L1', title: "Complete Blood Count", date: "2023-07-15", status: "Ready" },
  { id: 'L2', title: "Lipid Profile", date: "2023-08-01", status: "Ready" },
  { id: 'L3', title: "Liver Function Test", date: "2023-08-10", status: "Pending" },
];

const sampleDiagnosticsReports = [
  { id: 'D1', title: "Chest X-Ray", date: "2023-07-20", status: "Ready" },
  { id: 'D2', title: "ECG", date: "2023-08-05", status: "Ready" },
  { id: 'D3', title: "MRI Brain", date: "2023-08-15", status: "Pending" },
];

const PatientDashboard = ({ 
  patient = samplePatient, 
  labReports = sampleLabReports, 
  diagnosticsReports = sampleDiagnosticsReports 
}) => {
  const [activeTab, setActiveTab] = useState('lab');
  const [sortOrder, setSortOrder] = useState('desc');

  const TabButton = ({ id, label, comingSoon = false }) => (
    <button
      onClick={() => !comingSoon && setActiveTab(id)}
      className={`px-4 py-2 font-medium rounded-t-lg flex items-center justify-between ${
        activeTab === id
          ? 'bg-white text-teal-600 border-t-2 border-teal-600'
          : comingSoon
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      disabled={comingSoon}
    >
      {label}
      {comingSoon && (
        <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
          Coming Soon
        </span>
      )}
    </button>
  );

  const ReportCard = ({ id, title, date, status }) => (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">Date: {date}</p>
      <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
        status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {status}
      </span>
      <div className="mt-4 flex justify-between items-center">
        <button 
          onClick={() => console.log(`View report: ${title}`)}
          className="text-teal-600 hover:text-teal-800"
        >
          View
        </button>
        <button 
          onClick={() => console.log(`Downloading report: ${title}`)}
          className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
        >
          Download
        </button>
      </div>
    </div>
  );

  const sortReports = (reports) => {
    return [...reports].sort((a, b) => {
      return sortOrder === 'desc' 
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const currentReports = activeTab === 'lab' ? labReports : diagnosticsReports;
  const sortedReports = sortReports(currentReports);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-teal-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Portal</h1>
          <div className="flex items-center space-x-4">
            <span>{patient.name}</span>
            <button className="bg-teal-700 px-3 py-1 rounded hover:bg-teal-800">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Patient Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">UHI</p>
              <p className="font-medium">{patient.uhi}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mobile Number</p>
              <p className="font-medium">{patient.mobileNumber}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-2 px-4 py-2" aria-label="Tabs">
              <TabButton id="lab" label="Lab Reports" />
              <TabButton id="diagnostics" label="Diagnostics Reports" />
              <TabButton id="appointments" label="Appointments" comingSoon={true} />
              <TabButton id="prescriptions" label="Prescriptions" comingSoon={true} />
              <TabButton id="discharge" label="Discharge Summary" comingSoon={true} />
              <TabButton id="bills" label="Bills" comingSoon={true} />
            </nav>
          </div>
          
          {(activeTab === 'lab' || activeTab === 'diagnostics') && (
            <div className="p-4">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={toggleSortOrder}
                  className="text-teal-600 hover:text-teal-800"
                >
                  Sort by Date: {sortOrder === 'desc' ? '↓' : '↑'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedReports.length > 0 ? (
                  sortedReports.map((report) => (
                    <ReportCard key={report.id} {...report} />
                  ))
                ) : (
                  <p className="col-span-3 text-center text-gray-500">No reports available.</p>
                )}
              </div>
            </div>
          )}

          {['appointments', 'prescriptions', 'discharge', 'bills'].includes(activeTab) && (
            <div className="p-4 text-center">
              <p className="text-xl text-gray-600">This feature is coming soon!</p>
              <p className="mt-2 text-gray-500">We're working hard to bring you this functionality.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
