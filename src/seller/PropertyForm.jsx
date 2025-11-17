// src/seller/PropertyForm.jsx
import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "",
    price: "",
    size: "",
    city: "",
    type: "",
    amenities: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await API.get(`/properties/${id}`);
          // server maps fields to frontend-friendly keys
          setData((prev) => ({ ...prev, ...res.data }));
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [id]);

  const handleFile = (e) => {
    setData((prev) => ({ ...prev, images: e.target.files }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      // Append known fields
      form.append("title", data.title ?? "");
      form.append("totalPrice", data.price ?? ""); // backend expects totalPrice or price fallback
      form.append("squareMeters", data.size ?? "");
      form.append("city", data.city ?? "");
      form.append("type", data.type ?? "");
      form.append("description", data.description ?? "");
      if (data.amenities) form.append("amenities", data.amenities); // comma separated or string
      if (data.images && data.images.length) {
        Array.from(data.images).forEach((f) => form.append("images", f));
      }
      if (id) {
        await API.put(`/properties/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await API.post("/properties", form, { headers: { "Content-Type": "multipart/form-data" } });
      }
      navigate("/seller/properties");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{id ? "Edit" : "Add"} Property</h2>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
        <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="Title" className="w-full border p-2 rounded" required />
        <div className="grid grid-cols-2 gap-2">
          <input value={data.price} onChange={(e) => setData({ ...data, price: e.target.value })} placeholder="Price" className="w-full border p-2 rounded" required />
          <input value={data.size} onChange={(e) => setData({ ...data, size: e.target.value })} placeholder="Size (sqm)" className="w-full border p-2 rounded" required />
        </div>
        <input value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} placeholder="City" className="w-full border p-2 rounded" />
        <input value={data.type} onChange={(e) => setData({ ...data, type: e.target.value })} placeholder="Type" className="w-full border p-2 rounded" />
        <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Description" className="w-full border p-2 rounded" />
        <input type="file" multiple onChange={handleFile} />
        <button className="px-4 py-2 bg-black text-white rounded">Save</button>
      </form>
    </div>
  );
}
