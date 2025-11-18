// src/seller/SellerDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
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

      {/* optional extra widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h4 className="text-sm font-medium">Recent Activity</h4>
          <p className="text-xs text-gray-500 mt-2">No recent activity.</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h4 className="text-sm font-medium">Profile</h4>
          <p className="text-xs text-gray-500 mt-2">Complete your seller profile to get more leads.</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h4 className="text-sm font-medium">Support</h4>
          <p className="text-xs text-gray-500 mt-2">Contact support for help with listings.</p>
        </div>
      </div>
    </div>
  );
}
