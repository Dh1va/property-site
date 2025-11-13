// src/components/SecureRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const SecureRoute = ({ allowedRole, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to={`/${allowedRole}/login`} replace />;
  if (role !== allowedRole) return <Navigate to={`/${allowedRole}/login`} replace />;
  return children;
};

export default SecureRoute;
