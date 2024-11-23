import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const LoginPrivateRoute = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem("patientData");
        if (token) {
          // Dynamically import jwt-decode
          const jwtDecode = (await import("jwt-decode")).default || (await import("jwt-decode")).jwtDecode;

          // Decode the token
          const decoded = jwtDecode(token);

          // Check if the token is expired
          const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
          if (decoded.exp < currentTime) {
            console.warn("Token has expired");
            localStorage.removeItem("patientData"); // Clear expired token
            setUserData(null);
          } else {
            setUserData(decoded);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Failed to decode patientData:", error);
        setUserData(null);
      } finally {
        setLoading(false); // Finish loading
      }
    };

    checkToken();
  }, []);

  // While loading the token or checking its validity, show a loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If userData is null, it means no valid token, redirect to login
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected children if token is valid
  return children;
};

export default LoginPrivateRoute;
