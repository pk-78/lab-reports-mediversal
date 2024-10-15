import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { useState } from "react";
import LoginPage from "./pages/modern-patient-login";
import OTPVerificationPage from "./pages/patient-portal-otp-verification";
import PatientDashboard from "./pages/patient-dashboard";
import AdminReportUploadPortal from "./pages/admin-report-upload-portal-with-success-message-fixed";
import AdminUserManagementDashboard from "./pages/admin-user-management-dashboard-modern";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp-verify" element={<OTPVerificationPage />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/reportUpload" element={<AdminReportUploadPortal />} />
          <Route path="/userManagement" element={<AdminUserManagementDashboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
