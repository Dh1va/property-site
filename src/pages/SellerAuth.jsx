// src/pages/SellerAuth.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const SellerAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/seller";

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // register state
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await api.post("/api/sellers/login", { email: loginEmail, password: loginPassword });
      const token = res.data?.token;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      localStorage.setItem("role", res.data.role || "seller");
      localStorage.setItem("name", res.data.name || "");
      // optional: check isActive and warn
      if (!res.data.isActive) {
        // login succeeded but seller inactive; still store token if you want, or force logout
        // we'll redirect to seller dashboard only if active
        alert("Your seller account is not activated yet. Wait for admin activation.");
        setLoginLoading(false);
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message || "Login failed");
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setRegLoading(true);
    try {
      await api.post("/api/sellers/register", { name: regName, email: regEmail, password: regPassword });
      setRegSuccess("Registered successfully. Wait for admin activation before logging in.");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegLoading(false);
      setShowRegister(false);
    } catch (err) {
      setRegError(err.response?.data?.message || err.message || "Registration failed");
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Seller Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && <div className="text-sm text-red-600">{loginError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="mt-1 w-full p-2 border rounded" />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" disabled={loginLoading} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              {loginLoading ? "Logging in..." : "Login"}
            </button>

            <button type="button" onClick={() => setShowRegister((s) => !s)} className="text-sm text-blue-600 hover:underline">
              {showRegister ? "Hide register" : "New seller? Register here"}
            </button>
          </div>
        </form>

        {showRegister && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">Seller Registration</h2>
            {regError && <div className="text-sm text-red-600 mb-2">{regError}</div>}
            {regSuccess && <div className="text-sm text-green-600 mb-2">{regSuccess}</div>}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} required className="mt-1 w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="mt-1 w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={6} className="mt-1 w-full p-2 border rounded" />
              </div>
              <div className="flex items-center justify-between">
                <button type="submit" disabled={regLoading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  {regLoading ? "Registering..." : "Register"}
                </button>
                <button type="button" onClick={() => { setShowRegister(false); setRegError(""); setRegSuccess(""); }} className="text-sm text-gray-600 hover:underline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAuth;
