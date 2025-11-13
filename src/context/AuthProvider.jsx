// src/context/AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  user: null,      // { id, role, name, isActive? }
  verifying: true, // while checking /api/auth/me
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  // verify on mount
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setVerifying(false);
        return;
      }
      try {
        const res = await api.get("/api/auth/me"); // server verifies token
        setUser(res.data); // { id, role, name, isActive? }
      } catch (err) {
        console.warn("auth verify failed:", err?.response?.data?.message || err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, verifying, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
