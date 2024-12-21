import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { MdFileDownload } from "react-icons/md";
import url from "../auth/url";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PatientDashboard from "./patient-dashboard";

export default function AdminViewReport() {
  const [currentPage, setCurrentPage] = useState("Patient Reports");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [totalReport, setTotalReport] = useState(null);

  const dateToday = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(dateToday);
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  const formattedDate = fifteenDaysAgo.toISOString().split("T")[0];

  const handlePatientSearch = (e) => {
    e.preventDefault();
    const searchTerm = patientSearchTerm.toLowerCase();

    const foundPatient = users.find(
      (patient) =>
        patient.UHID?.toLowerCase() === searchTerm ||
        patient.number?.toLowerCase() === "+91" + searchTerm
    );
  };
  const SearchedPatient = () => {
    if (selectedPatient !== "") return null;

    const filteredPatients = users?.filter(
      (patient) =>
        patient?.UHID?.toLowerCase().includes(
          patientSearchTerm.toLowerCase()
        ) ||
        patient?.number?.toLowerCase().includes(patientSearchTerm.toLowerCase())
    );
    // console.log(filteredPatients);

    // Limit the display to the first 10 patients
    const displayedPatients = filteredPatients?.slice(0, 10);

    return (
      <div className="my-4">
        {filteredPatients?.length > 0 ? (
          <>
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
              <thead>
                <tr className="">
                  <th className="py-3 px-6 text-xs lg:text-base  border-b  font-semibold">
                    Name
                  </th>
                  <th className="py-3 px-6 text-xs lg:text-base border-b  font-semibold">
                    UHID
                  </th>
                  <th className="py-3 px-6 text-xs lg:text-base border-b  font-semibold">
                    Number
                  </th>
                  <th className="py-3 px-6 text-xs lg:text-base border-b  font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedPatients.map((patient) => (
                  <tr key={patient.UHID} className="hover:bg-gray-100">
                    <td className="py-3 px-3  lg:text-base text-xs border-b">
                      {patient?.name}
                    </td>
                    <td className="py-3 px-3  lg:text-base   text-xs border-b">
                      {patient?.UHID}
                    </td>
                    <td className="py-3 px-3  lg:text-base text-xs border-b">
                      {patient?.number}
                    </td>
                    <td className="py-3 px-3   lg:text-base text-xs border-b">
                      <button
                        onClick={() => {
                          setShowReport(true);
                          setSelectedPatient(patient);
                        }}
                        className="rounded bg-teal-600 text-white py-1 px-4 flex items-center justify-center"
                      >
                        <span className=" lg:inline">View Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length > 10 && (
              <p className="text-gray-500 mt-2">
                Showing 10 of {filteredPatients?.length} matching patients.
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500">No matching patients found</p>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      setFetchLoading(true);

      try {
        const response = await axios.get(`${url}/api/v1/auth/patients`);

        setUsers(response.data);
      } catch (err) {
        setError(err.message);
        toast.error("Error while fetching, please refresh");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  useEffect(() => {
    const fetchDailyReport = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/auth/reports15days`);

        setTotalReport(response.data);
        // console.log(response.data);
      } catch (err) {
        setError(err.message);
        toast.error("Error while fetching, please refresh");
      }
    };

    fetchDailyReport();
  }, []);

  const allReports = [
    {
      id: "1",
      name: "Liver Function Test",
      patientName: "Aarav Patel",
      patientUHI: "11-1111-1111-1111",
      date: "2023-08-10",
      status: "Pending",
      type: "Lab",
      uploadedBy: {
        id: "u1",
        name: "Dr. Sarah Johnson",
        role: "Lab Technician",
      },
    },
    {
      id: "2",
      name: "Lipid Profile",
      patientName: "Aarav Patel",
      patientUHI: "11-1111-1111-1111",
      date: "2023-08-09",
      status: "Completed",
      type: "Lab",
      uploadedBy: {
        id: "u2",
        name: "Dr. Michael Chen",
        role: "Lab Supervisor",
      },
    },
    {
      id: "3",
      name: "Complete Blood Count",
      patientName: "Priya Singh",
      patientUHI: "22-2222-2222-2222",
      date: "2023-08-11",
      status: "Completed",
      type: "Lab",
      uploadedBy: {
        id: "u3",
        name: "Dr. Emily Wong",
        role: "Lab Technician",
      },
    },
    {
      id: "4",
      name: "X-Ray Chest",
      patientName: "Rahul Sharma",
      patientUHI: "33-3333-3333-3333",
      date: "2023-08-12",
      status: "Pending",
      type: "Diagnostic",
      uploadedBy: {
        id: "u4",
        name: "Dr. Alex Turner",
        role: "Radiologist",
      },
    },
  ];

  const PatientReport = () => {
    return (
      <div>
        {fetchLoading && (
          <div> Please wait while we fetching patients Details..</div>
        )}
        {error && (
          <div className="text-red-600 text-sm">
            {error},Please refresh your page
          </div>
        )}
        {patientSearchTerm && <SearchedPatient />}
      </div>
    );
  };
  // console.log(selectedPatient?._id);
  const ReportTracking = () => {
    return (
      <div className="mx-6">
        <div className=" my-4 text-2xl font-bold">Report Tracking</div>

        <div className="flex gap-4 ">
          <input
            type="text"
            placeholder="Search.."
            className="border border-slate-900 rounded pl-2"
          />
          <button className="bg-teal-600 text-white px-3 py-1 rounded">
            Search
          </button>
        </div>
        <div className="bg-gray-200">
          <table className="min-w-full leading-normal mt-2 bg-gray-200">
            <thead className="text-gray-600">
              <tr>
                <th className="px-2 py-3 w-1/12 border-b-2     text-xs font-semibold text-black uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-5 py-3 w-1/6 border-b-2    text-xs font-semibold text-black uppercase tracking-wider">
                  Patient
                </th>

                <th className="px-5 py-3 w-1/6 border-b-2    text-xs font-semibold text-black uppercase tracking-wider">
                  Date
                </th>

                <th className="px-5 py-3 w-3/12 border-b-2    text-xs font-semibold text-black uppercase tracking-wider">
                  Type
                </th>
                <th className="px-5 py-3 w-3/12 border-b-2    text-xs font-semibold text-black uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-5 py-3 w-3/12 border-b-2    text-xs font-semibold text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allReports.map((report) => (
                <tr key={report._id}>
                  {/* {console.log("ye le", course?.courseDepartment)} */}
                  <td className="px-1 py-1 w-1/12 border-b   text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {report?.name}
                    </p>
                  </td>
                  <td className="px-5 py-3 w-1/6 border-b   text-sm ">
                    <p className=" text-black whitespace-no-wrap">
                      {report?.patientName}
                    </p>
                  </td>

                  <td className="px-5 py-3 w-1/6 border-b  text-black  text-sm ">
                    <p className=" whitespace-no-wrap">{report?.date}</p>
                  </td>
                  <td className="px-5 py-3 w-3/12 border-b   text-sm ">
                    <div className="whitespace-no-wrap">{report?.type}</div>
                  </td>
                  <td className="px-5 py-3 w-3/12 border-b   text-sm ">
                    <div className="whitespace-no-wrap">
                      {report?.uploadedBy?.name}
                    </div>
                  </td>
                  <td className="px-5 py-3 w-3/12 border-b flex    gap-3 text-lg">
                    <button>
                      <IoEye />
                    </button>
                    <button>
                      <MdFileDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const UserUpload = () => {
    // Filter data based on selected date
    const filteredData = selectedDate
      ? totalReport
          .filter((user) => {
            // Filter out users who have no uploads for the selected date
            const userUploadsForDate = user.dailyCounts.some(
              (entry) => entry.date === selectedDate
            );
            return userUploadsForDate;
          })
          .map((user) => ({
            _id: user._id,
            dailyCounts: user.dailyCounts.filter(
              (entry) => entry.date === selectedDate
            ),
          }))
      : totalReport;

    return (
      <div className="mx-6">
        <div className="flex justify-between">
          <div className="my-4 text-2xl font-bold">User Upload</div>
          <div className="flex mt-6">
            <label htmlFor="selectDate">Select Date: </label>
            <div>
              <input
                type="date"
                id="selectDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={formattedDate}
                max={dateToday}
                className=""
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-md h-screen p-5">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-teal-600 text-white text-sm uppercase font-semibold">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Total Uploads</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((user) =>
                  user.dailyCounts.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-100 transition duration-200"
                    >
                      <td className="pl-6 py-4 text-sm text-gray-800">
                        {user._id || "No name"}
                      </td>
                      <td className="py-4 text-sm text-gray-800 text-left">
                        Lab Technician
                      </td>
                      <td className="py-4 text-sm text-gray-800 text-left">
                        {entry.date}
                      </td>
                      <td className="py-4 text-sm text-gray-800 pl-16 text-left">
                        {entry?.count}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-sm text-gray-800"
                  >
                    No data available for the selected date. please select date
                    after {formattedDate}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen">
      {showReport && (
        <div>
          <PatientDashboard
            className="relative"
            uniqueId={selectedPatient._id}
            role="admin"
          />
          <button
            onClick={() => {
              setShowReport(false);
              setSelectedPatient("");
            }}
            className="absolute top-4 right-2 bg-teal-700 text-white rounded-md px-3 py-1"
          >
            close
          </button>
        </div>
      )}
      {!showReport && (
        <div>
          <div className="bg-teal-600 flex justify-between px-3 py-3 text-white text-2xl font-bold">
            <div>View Patient Reports</div>
            <div>
              {" "}
              <button
                onClick={() => navigate("/adminUserManagement")}
                className="font-semibold text-lg bg-teal-700 px-3 rounded-md"
              >
                Back
              </button>
            </div>
          </div>
          <div className="flex h-screen">
            <div className="w-1/6 mt-6 bg-white">
              <div className=" text-lg">
                <button
                  onClick={() => setCurrentPage("Patient Reports")}
                  className="py-2  hover:bg-gray-200 w-full"
                >
                  Patient Reports
                </button>
                {/* <button
                  onClick={() => setCurrentPage("Reports Tracking")}
                  className="py-2 hover:bg-gray-200 w-full"
                >
                  Reports Tracking
                </button> */}
                <button
                  onClick={() => setCurrentPage("User Uploads")}
                  className="py-2 hover:bg-gray-200 w-full"
                >
                  User Uploads
                </button>
              </div>
            </div>
            <div className="w-5/6  bg-gray-50">
              {currentPage === "Patient Reports" ? (
                <div className="m-6">
                  <div className=" my-4 text-2xl font-bold">Patient Report</div>

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
                          }}
                          className="ml-1 px-3 py-2 bg-teal-600 text-white text-sm lg:text-lg rounded-md hover:bg-teal-700 transition-colors duration-150"
                        >
                          Search Other Patient
                        </button>
                      )}
                    </div>
                  </form>
                  <PatientReport />
                  <div className="absolute w-full"></div>
                </div>
              ) : currentPage === "Reports Tracking" ? (
                <ReportTracking />
              ) : (
                <UserUpload />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
