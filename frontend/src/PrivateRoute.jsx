import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

// Function to decode JWT and extract the payload
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Decode base64
    const decoded = JSON.parse(atob(base64)); // Decode and parse JSON
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const PrivateRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      try {
        // Decode the JWT token from userData
        const decodedToken = decodeJWT(userData);

        // Check if the decoded token has the required role
        if (decodedToken && decodedToken.role === requiredRole) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [requiredRole]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
