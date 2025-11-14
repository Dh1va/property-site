// src/components/RequireAuth.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const RequireAuth = ({ allowedRole, children }) => {
  const { user, verifying } = useContext(AuthContext);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Verifying credentials…</div>
      </div>
    );
  }

  if (!user) return <Navigate to={`/${allowedRole}/login`} replace />;

  if (user.role !== allowedRole) return <Navigate to={`/${allowedRole}/login`} replace />;

  if (allowedRole === "seller" && user.isActive === false) {
    return <div className="p-6">Your seller account is not activated yet.</div>;
  }

  return children;
};

export default RequireAuth;
