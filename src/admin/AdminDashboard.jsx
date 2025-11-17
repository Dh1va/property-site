// src/admin/AdminDashboard.jsx
import React from "react";
import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Manage Sellers</h3>
          <p className="text-sm text-gray-600">Approve or deactivate seller accounts.</p>
          <Link to="/admin/sellers" className="mt-4 inline-block text-sm text-blue-600">Open →</Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Properties</h3>
          <p className="text-sm text-gray-600">View, edit, or delete any property.</p>
          <Link to="/admin/properties" className="mt-4 inline-block text-sm text-blue-600">Open →</Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Enquiries</h3>
          <p className="text-sm text-gray-600">View incoming enquiries and reference numbers.</p>
          <Link to="/admin/enquiries" className="mt-4 inline-block text-sm text-blue-600">Open →</Link>
        </div>
      </div>
    </AdminLayout>
  );
}
