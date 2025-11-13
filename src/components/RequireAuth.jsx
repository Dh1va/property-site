// src/components/RequireAuth.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const RequireAuth = ({ allowedRole, children }) => {
  const { user, verifying } = useContext(AuthContext);

  if (verifying) {
    // show spinner / placeholder while verifying with server
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Verifying credentials…</div>
      </div>
    );
  }

  // not logged in
  if (!user) return <Navigate to={`/${allowedRole}/login`} replace />;

  // logged in but wrong role
  if (user.role !== allowedRole) return <Navigate to={`/${allowedRole}/login`} replace />;

  // seller is inactive (if you want to block access even if token valid)
  if (allowedRole === "seller" && user.isActive === false) {
    return <div className="p-6">Your seller account is not activated yet.</div>;
  }

  return children;
};

export default RequireAuth;
