// src/admin/ManageSellers.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function ManageSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/admin/sellers");
        setSellers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = async (id, activate) => {
    try {
      await API.put(`/admin/sellers/${id}/activate`, { activate });
      setSellers((prev) => prev.map((s) => (s._id === id ? { ...s, isActive: activate } : s)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sellers</h2>
      <div className="space-y-4">
        {sellers.map((s) => (
          <div key={s._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-600">{s.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${s.isActive ? "text-green-600" : "text-red-600"}`}>
                {s.isActive ? "Active" : "Inactive"}
              </span>
              <button onClick={() => toggle(s._id, !s.isActive)} className="px-3 py-1 border rounded">
                {s.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
