// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/admin/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role || "admin");
      localStorage.setItem("name", res.data.name || "");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username" className="w-full p-2 border rounded" required/>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="password" className="w-full p-2 border rounded" required/>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-black text-white rounded">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
