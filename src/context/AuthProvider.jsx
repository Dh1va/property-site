// src/context/AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  user: null,
  verifying: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) setVerifying(false);
        return;
      }
      try {
        const res = await api.get("/api/auth/me");
        if (mounted) setUser(res.data);
      } catch (err) {
        console.warn("auth verify failed:", err?.response?.data?.message || err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        if (mounted) setUser(null);
      } finally {
        if (mounted) setVerifying(false);
      }
    };
    verify();
    return () => { mounted = false; };
  }, []);

  // login: accept { token, role } returned by server login
  const login = async ({ token, role }) => {
    if (token) localStorage.setItem("token", token);
    if (role) localStorage.setItem("role", role);
    try {
      setVerifying(true);
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.warn("login -> fetch /me failed:", err?.response?.data || err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      throw err;
    } finally {
      setVerifying(false);
    }
  };

  const logout = async () => {
    try { await api.post("/api/auth/logout").catch(()=>{}); } catch(e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, verifying, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
