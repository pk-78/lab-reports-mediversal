import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useState } from "react";
import LoginPage from "./pages/modern-patient-login";
import OTPVerificationPage from "./pages/patient-portal-otp-verification";
import PatientDashboard from "./pages/patient-dashboard";
import AdminReportUploadPortal from "./pages/admin-report-upload-portal-with-success-message-fixed";
import AdminUserManagementDashboard from "./pages/admin-user-management-dashboard-modern";
import AdminLoginPage from "./pages/admin-login";
import PostLoginUHIDSelection from "./pages/post-login-uhid-selection";
import PrivateRoute from "./PrivateRoute";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/otp-verify" element={<OTPVerificationPage />} />
          <Route path="/post-uhid-selection" element={<PostLoginUHIDSelection />} />
          <Route path="/dashboard/:id" element={<PatientDashboard />} />

          {/* Secure the report upload route for users with the "Uploader" role */}
          <Route
            path="/reportUpload"
            element={
              <PrivateRoute requiredRole="Uploader">   {/* Uploader role required */}
                <AdminReportUploadPortal />
              </PrivateRoute>
            }
          />

          {/* Admin user management, secured for admin or super admin */}
          <Route
            path="/adminUserManagement"
            element={
              <PrivateRoute requiredRole="Admin">    {/* Admin role required */}
                <AdminUserManagementDashboard />
              </PrivateRoute>
            }
          />
           <Route
            path="/adminUserManagement"
            element={
              <PrivateRoute requiredRole="SuperAdmin">    {/* Admin role required */}
                <AdminUserManagementDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
