import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const UploaderRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize with null to show loading state initially

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      try {
        // Check if the role is "Uploader"
        if (userData.role === "Uploader") {
          setIsAuthenticated(true); // User is authenticated and role is correct
        } else {
          setIsAuthenticated(false); // User role is not "Uploader"
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsAuthenticated(false); // If error occurs during parsing, set as unauthenticated
      }
    } else {
      setIsAuthenticated(false); // No user data found, so not authenticated
    }
  }, []); // Empty dependency array means this effect runs only on mount

  // Show loading state if `isAuthenticated` is still null
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // You can add a loading spinner or message here
  }

  // Redirect if not authenticated or role is not "Uploader"
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated and role is "Uploader", render the children components
  return children;
};

export default UploaderRoute;
