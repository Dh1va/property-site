// src/pages/AdminLogin.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthProvider";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, role } = res.data; // server must return token & role
      await login({ token, role });
      navigate(role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" className="w-full border p-2" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
        <button className="px-4 py-2 bg-black text-white rounded" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </div>
  );
}
