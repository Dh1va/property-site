// src/seller/MyProperties.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProps = async () => {
    setLoading(true);
    try {
      // your seller endpoint
      const res = await API.get("/sellers/me/properties");
      setProperties(res.data || []);
    } catch (err) {
      console.error("Failed to fetch seller properties", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doDelete = async (id) => {
    if (!confirm("Delete this property? This action cannot be undone.")) return;
    try {
      await API.delete(`/properties/${id}`);
      // remove locally
      setProperties((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading properties…</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Properties</h2>
        <div>
          <button
            onClick={() => navigate("/seller/properties/new")}
            className="px-4 py-2 bg-black text-white rounded cursor-pointer"
          >
            Add Property
          </button>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-gray-500">You have no properties yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => {
            const id = p._id || p.id;
            const img = p.images?.[0] || "";
            const price = p.totalPrice ?? p.price ?? null;
            return (
              <div key={id} className="bg-white p-4 rounded shadow flex flex-col">
                <div className="w-full h-40 mb-3 bg-gray-100 rounded overflow-hidden">
                  {img ? (
                    <img src={img} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-600">{p.city || p.place || "-"}, {p.country || "-"}</p>
                  <p className="mt-2 font-semibold">
                    {price !== null ? `CHF ${Number(price).toLocaleString()}` : "-"}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/seller/properties/${id}`)}
                    className="px-3 py-1 border rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => doDelete(id)}
                    className="px-3 py-1 border rounded text-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
