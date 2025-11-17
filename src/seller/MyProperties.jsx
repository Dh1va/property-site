// src/seller/MyProperties.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MyProperties() {
  const [props, setProps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/sellers/me/properties");
        setProps(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const del = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await API.delete(`/properties/${id}`);
      setProps((p) => p.filter((x) => x._id !== id && x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Properties</h2>
        <button onClick={() => navigate("/seller/properties/new")} className="px-4 py-2 bg-black text-white rounded">Add Property</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {props.map((p) => (
          <div key={p._id || p.id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">
                  {p.city} — CHF {p.price?.toLocaleString?.() || p.totalPrice}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => navigate(`/seller/properties/${p._id || p.id}`)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={() => del(p._id || p.id)} className="px-3 py-1 border rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
