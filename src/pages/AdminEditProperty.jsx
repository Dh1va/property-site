import React, { useEffect, useState } from 'react';
import PropertyForm from '../components/PropertyForm';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../utils/apiClient';

export default function AdminEditProperty() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getPropertyById(id).then(data => { if (mounted) setProperty(data); }).catch(console.error);
    return () => (mounted = false);
  }, [id]);

  const handleSave = async (formData) => {
    try {
      await updateProperty(id, formData);
      navigate('/admin/properties');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Update failed');
    }
  };

  if (!property) return <div>Loading property...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <PropertyForm editingProperty={property} onSave={handleSave} cancelEdit={() => navigate('/admin/properties')} />
    </div>
  );
}
