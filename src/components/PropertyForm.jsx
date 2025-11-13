// src/components/PropertyForm.jsx
import React, { useState, useEffect } from "react";

const PropertyForm = ({ onSave, editingProperty, cancelEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    refNumber: "",
    totalPrice: "",
    squareMeters: "",
    zip: "",
    place: "",
    city: "",
    country: "",
    rooms: "",
    bathrooms: "",
    pool: false,
    parking: false,
    garden: false,
    type: "",
    amenities: "",
    images: [],
    description: "",
  });

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (editingProperty) {
      setFormData({
        title: editingProperty.title || "",
        refNumber: editingProperty.refNumber || "",
        totalPrice: editingProperty.totalPrice ?? editingProperty.price ?? "",
        squareMeters: editingProperty.squareMeters || editingProperty.size || "",
        zip: editingProperty.zip || "",
        place: editingProperty.place || "",
        city: editingProperty.city || "",
        country: editingProperty.country || "",
        rooms: editingProperty.rooms || "",
        bathrooms: editingProperty.bathrooms || "",
        pool: !!editingProperty.pool,
        parking: !!editingProperty.parking,
        garden: !!editingProperty.garden,
        type: editingProperty.type || "",
        amenities: (editingProperty.amenities || []).join(", "),
        images: [],
        description: editingProperty.description || "",
      });
      setPreviewImages(editingProperty.images || []);
    } else {
      setFormData({
        title: "",
        refNumber: "",
        totalPrice: "",
        squareMeters: "",
        zip: "",
        place: "",
        city: "",
        country: "",
        rooms: "",
        bathrooms: "",
        pool: false,
        parking: false,
        garden: false,
        type: "",
        amenities: "",
        images: [],
        description: "",
      });
      setPreviewImages([]);
    }
  }, [editingProperty]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === "images") continue;
      if (key === "amenities") {
        // send as comma-separated string; backend expects array or handles it
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    }

    for (let img of formData.images) {
      data.append("images", img);
    }

    await onSave(data);

    // reset after submit
    setFormData({
      title: "",
      refNumber: "",
      totalPrice: "",
      squareMeters: "",
      zip: "",
      place: "",
      city: "",
      country: "",
      rooms: "",
      bathrooms: "",
      pool: false,
      parking: false,
      garden: false,
      type: "",
      amenities: "",
      images: [],
      description: "",
    });
    setPreviewImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
      <h2 className="text-xl font-semibold mb-2">{editingProperty ? "Edit Property" : "Add New Property"}</h2>

      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="refNumber" placeholder="Reference Number" value={formData.refNumber} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="totalPrice" placeholder="Total Price (CHF)" value={formData.totalPrice} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="squareMeters" placeholder="Square Meters" value={formData.squareMeters} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="place" placeholder="Place" value={formData.place} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="rooms" placeholder="Rooms" value={formData.rooms} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="bathrooms" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="type" placeholder="Type (e.g., Apartment, Villa)" value={formData.type} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="amenities" placeholder="Amenities (comma separated)" value={formData.amenities} onChange={handleChange} className="border p-2 rounded col-span-2" />
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" placeholder="Enter property description" value={formData.description} onChange={handleChange} rows={4} className="border p-2 rounded w-full" />
      </div>

      {/* Boolean Features */}
      <div className="flex gap-6 mt-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="pool" checked={formData.pool} onChange={handleChange} />
          Pool
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} />
          Parking
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="garden" checked={formData.garden} onChange={handleChange} />
          Garden
        </label>
      </div>

      {/* Image Upload */}
      <div className="mt-4">
        <label className="block mb-1 font-medium">Upload Images</label>
        <input type="file" multiple onChange={handleImageChange} accept="image/*" className="border p-2 rounded w-full" />
      </div>

      {/* Preview */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-3">
          {previewImages.map((src, idx) => (
            <img key={idx} src={src} alt="preview" className="w-full h-32 object-cover rounded" />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          {editingProperty ? "Update" : "Add Property"}
        </button>

        {editingProperty && (
          <button type="button" onClick={cancelEdit} className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PropertyForm;
