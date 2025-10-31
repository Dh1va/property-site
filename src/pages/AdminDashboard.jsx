import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminPropertyTable from "../components/AdminPropertyTable";
import PropertyForm from "../components/PropertyForm";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) navigate("/admin/login");

  // Fetch properties
  const fetchProperties = async () => {
    const res = await axios.get("http://localhost:5000/api/properties");
    setProperties(res.data);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProperties();
  };

  // Add or Update
  const handleSave = async (formData) => {
    if (editingProperty) {
      await axios.put(
        `http://localhost:5000/api/properties/${editingProperty._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post("http://localhost:5000/api/properties", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    fetchProperties();
    setEditingProperty(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px] p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/admin/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <PropertyForm
        onSave={handleSave}
        editingProperty={editingProperty}
        cancelEdit={() => setEditingProperty(null)}
      />

      <AdminPropertyTable
        properties={properties}
        onEdit={setEditingProperty}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminDashboard;
