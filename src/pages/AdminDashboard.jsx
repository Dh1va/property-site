// src/pages/AdminDashboard.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="p-8 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate("/admin/add")} className="px-3 py-2 bg-black text-white rounded">Add Property</button>
          <button onClick={() => navigate("/admin/sellers")} className="px-3 py-2 bg-gray-200 rounded">Manage Sellers</button>
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>
      <p>Welcome, {user?.name || user?.email || "Admin"}.</p>
    </div>
  );
}
