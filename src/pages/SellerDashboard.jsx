// src/pages/SellerDashboard.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function SellerDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate("/seller/properties")} className="px-3 py-2 bg-black text-white rounded">My Properties</button>
          <button onClick={() => navigate("/seller/add")} className="px-3 py-2 bg-gray-200 rounded">Add Property</button>
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>
      <p>Welcome, {user?.name || user?.email || "Seller"}.</p>
    </div>
  );
}
