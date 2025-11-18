// src/seller/SellerRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function SellerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    phone: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }

    try {
      setBusy(true);

      const res = await API.post("/sellers/register", form);

      if (res?.data?.success) {
        alert("Registration successful. Please login.");
        navigate("/seller/login");
      } else {
        setError(res?.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Seller Registration
        </h2>

        {error && (
          <div className="text-sm text-red-600 mb-3 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Company (optional)</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Phone (optional)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2 bg-black text-white rounded hover:bg-gray-900 transition"
          >
            {busy ? "Registering..." : "Register"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/seller/login")}
            className="w-full py-2 border rounded mt-2 hover:bg-gray-50 transition"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
