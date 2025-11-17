// src/admin/ManageProperties.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProps = async () => {
    try {
      setLoading(true);
      const res = await API.get("/properties");
      setProperties(res.data || []);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProps();
  }, []);

  const doDelete = async (id) => {
    if (!confirm("Delete this property? This action cannot be undone.")) return;
    try {
      await API.delete(`/properties/${id}`);
      // remove locally
      setProperties((p) => p.filter((x) => (x._id || x.id) !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading properties…</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Properties</h2>
        <div>
          <button onClick={() => navigate("/admin/properties/new")} className="px-4 py-2 bg-black text-white rounded">
            Add Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => {
          const id = p._id || p.id;
          return (
            <div key={id} className="bg-white p-4 rounded shadow flex flex-col">
              <img src={p.images?.[0] || ""} alt={p.title} className="w-full h-40 object-cover rounded mb-3" />
              <div className="flex-1">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.city}, {p.country}</p>
                <p className="mt-2 font-semibold">CHF {p.totalPrice ?? p.price?.toLocaleString?.() ?? p.totalPrice}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => navigate(`/admin/properties/${id}`)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={() => doDelete(id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
