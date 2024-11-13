import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import url from "../auth/url";

const PostLoginUHIDSelection = (
) => {
  const [selectedUHID, setSelectedUHID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { uhidList, number } = location.state || {}; 

  const navigate= useNavigate();
  useEffect(() => {
    // console.log("Received UHID List:", uhidList);
    // console.log("Received Number:", number);
  }, [uhidList, number]);





  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedUHID) {
      navigate(`/dashboard/${selectedUHID}`)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-teal-800 mb-2">
          Select Your UHID
        </h2>
        <p className="text-gray-600 mb-6">
          We've found multiple UHIDs linked to{" "}
          <span className="font-medium">{number}</span>. Please choose the one
          you want to use:
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {uhidList.map((uhid) => (
            <label
              key={uhid}
              className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedUHID === uhid
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-teal-300"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="uhid"
                  value={uhid._id}
                  checked={selectedUHID === uhid._id}
                  onChange={() => setSelectedUHID(uhid._id)}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 mr-3 rounded-full border-2 flex items-center justify-center ${
                    selectedUHID === uhid._id
                      ? "border-teal-500 bg-teal-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedUHID === uhid._id && (
                    <svg
                      className="w-4 h-4 text-white"
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
                  )}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  <span className="text-lg font-medium text-gray-900">
                    {uhid.UHID}
                  </span>
                </div>
              </div>
            </label>
          ))}
          <button
            type="submit"
            disabled={!selectedUHID || isLoading}
            className="relative w-full mt-6 bg-teal-600 text-white py-3 px-4 rounded-xl text-lg font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed overflow-hidden"
          >
            <span
              className={`inline-block transition-all duration-300 ${
                isLoading
                  ? "-translate-y-10 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              Continue with Selected UHID
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isLoading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostLoginUHIDSelection;
