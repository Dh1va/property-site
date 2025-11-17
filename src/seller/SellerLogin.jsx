// src/seller/SellerLogin.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default function SellerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login({ emailOrUsername: email, password, role: "seller" });
    if (res.success) navigate("/seller");
    else setError(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Seller Sign In</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-md p-2" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded-md p-2" required />
          <button className="w-full bg-black text-white py-2 rounded-md">Sign in</button>
        </form>
      </div>
    </div>
  );
}
