// src/pages/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove saved auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    // Redirect to login page
    navigate("/admin/login");
  };

  return (
    <div className="p-8 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <p className="mb-6">
        This is a placeholder dashboard. Replace with your real admin UI.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/admin/add")}
          className="px-3 py-2 bg-black text-white rounded"
        >
          Add Property
        </button>

        <button
          onClick={() => navigate("/admin/sellers")}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          Manage Sellers
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
