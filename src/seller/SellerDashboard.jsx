// src/seller/SellerDashboard.jsx
import React from "react";
import SellerLayout from "./SellerLayout";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  return (
    <SellerLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold">My Properties</h3>
          <p className="text-sm text-gray-600">View and manage properties you added.</p>
          <Link to="/seller/properties" className="mt-4 inline-block text-sm text-blue-600">Open →</Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Add New Property</h3>
          <p className="text-sm text-gray-600">Upload images and details for a new listing.</p>
          <Link to="/seller/properties/new" className="mt-4 inline-block text-sm text-blue-600">Open →</Link>
        </div>
      </div>
    </SellerLayout>
  );
}
