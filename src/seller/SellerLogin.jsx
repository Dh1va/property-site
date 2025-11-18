// src/seller/SellerLogin.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default function SellerLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext) || {};

  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      setBusy(true);

      // Use the same login contract as AdminLogin.
      // AuthContext.login should accept an object and return { success, ... }
      const res = await login({
        emailOrUsername: form.email,
        password: form.password,
        role: "seller",
      });

      // If your AuthContext returns a different shape, adapt this check.
      if (res?.success) {
        navigate("/seller");
      } else {
        setError(res?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Server error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold text-center mb-4">Seller Login</h2>

        {error && (
          <div className="text-sm text-red-600 mb-3 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2 bg-black text-white rounded hover:bg-gray-900 transition"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* ⬅ Back (left) | Register (right) */}
        <div className="flex justify-between items-center mt-6 text-sm">
          {/* Back to Home (left) */}
          <Link to="/" className="text-gray-700 flex items-center gap-1">
            <span className="text-lg">←</span>
            <span>Back to Home</span>
          </Link>

          {/* Register (right) */}
          <Link to="/seller/register" className="text-black font-semibold">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
