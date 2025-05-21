
import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  const tokenIsValid = isTokenValid();

  if (!tokenIsValid) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
