import React, { useState, useEffect } from "react";

/**
 * PropertyForm
 *
 * Props:
 * - onSave(formData, meta) : called when form is submitted. formData is FormData instance.
 *    meta = { removedExisting: [urlsRemoved], newFiles: [File,...] }
 * - editingProperty: optional object with existing property values (including `images` array of URLs)
 * - cancelEdit: optional function to cancel (used in edit mode)
 * - onUploadProgress: optional function(progressEvent) -> for parent to show upload progress
 *
 * Notes:
 * - This component does NOT call the API directly. Parent should call createProperty(formData)
 *   or updateProperty(id, formData) using your apiClient/axios.
 * - FormData fields used:
 *    title, refNumber, totalPrice, squareMeters, zip, place, city, country,
 *    rooms, bathrooms, pool (true/false), parking, garden, type,
 *    amenities (comma string), amenitiesJson (JSON string array),
 *    description,
 *    existingImages (JSON string array) -> images to KEEP (backend should remove others)
 *    images[] -> new File uploads (multiple)
 */

export default function PropertyForm({
  onSave,
  editingProperty = null,
  cancelEdit = null,
  onUploadProgress = null,
}) {
  const emptyForm = {
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
    amenities: "", // comma separated for UI
    images: [], // new File[] (not used directly in initial)
    description: "",
  };

  const [formDataState, setFormDataState] = useState(emptyForm);

  // existingImages: array of URLs when editing
  const [existingImages, setExistingImages] = useState([]); // urls
  // preview for new Files
  const [previewImages, setPreviewImages] = useState([]); // urls created by URL.createObjectURL
  // store actual File objects for new uploads
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    if (editingProperty) {
      setFormDataState((prev) => ({
        ...prev,
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
        amenities: (editingProperty.amenities && editingProperty.amenities.join ? editingProperty.amenities.join(", ") : (editingProperty.amenities || "")),
        images: [],
        description: editingProperty.description || "",
      }));
      setExistingImages(editingProperty.images || []);
      setPreviewImages([]); // new files preview cleared
      setNewFiles([]);
    } else {
      setFormDataState(emptyForm);
      setExistingImages([]);
      setPreviewImages([]);
      setNewFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProperty]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // append new files
    setNewFiles((prev) => [...prev, ...files]);

    // create previews for new files
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove a newly added file (before upload)
  const removeNewFile = (index) => {
    setNewFiles((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    setPreviewImages((prev) => {
      const copy = [...prev];
      // revoke object url to free memory
      URL.revokeObjectURL(copy[index]);
      copy.splice(index, 1);
      return copy;
    });
  };

  // Remove an existing image (when editing). Backend must be told which existing images to keep.
  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData
    const fd = new FormData();

    // simple scalar fields
    fd.append("title", formDataState.title);
    fd.append("refNumber", formDataState.refNumber);
    fd.append("totalPrice", formDataState.totalPrice);
    fd.append("squareMeters", formDataState.squareMeters);
    fd.append("zip", formDataState.zip);
    fd.append("place", formDataState.place);
    fd.append("city", formDataState.city);
    fd.append("country", formDataState.country);
    fd.append("rooms", formDataState.rooms);
    fd.append("bathrooms", formDataState.bathrooms);
    fd.append("pool", formDataState.pool ? "true" : "false");
    fd.append("parking", formDataState.parking ? "true" : "false");
    fd.append("garden", formDataState.garden ? "true" : "false");
    fd.append("type", formDataState.type);
    fd.append("description", formDataState.description || "");

    // Amenities:
    // send both a comma string (for backwards compatibility) and a JSON array.
    const amenitiesArr = formDataState.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    fd.append("amenities", formDataState.amenities || "");
    fd.append("amenitiesJson", JSON.stringify(amenitiesArr));

    // existingImages: when editing, send the array of URLs you want to KEEP.
    // Backend should remove other previously-saved images that were not included here.
    if (editingProperty) {
      fd.append("existingImages", JSON.stringify(existingImages || []));
    }

    // Append new files (if any)
    for (let file of newFiles) {
      fd.append("images", file); // backend expects 'images' as array (multiple)
    }

    // Build meta to help caller (which files were removed etc.)
    const removedExisting = (editingProperty?.images || []).filter((u) => !(existingImages || []).includes(u));
    const meta = { removedExisting, newFiles };

    // Call parent onSave. Parent should use apiClient.createProperty(fd) or updateProperty(id, fd).
    // We intentionally do not call the API directly here so the caller controls axios + progress handling.
    try {
      await onSave(fd, meta, onUploadProgress); // parent may optionally use onUploadProgress
    } catch (err) {
      // bubble up - parent pages should catch and show error. Here we can console log.
      console.error("PropertyForm onSave error:", err);
      throw err;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
      <h2 className="text-xl font-semibold mb-2">{editingProperty ? "Edit Property" : "Add New Property"}</h2>

      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="title" placeholder="Title" value={formDataState.title} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="refNumber" placeholder="Reference Number" value={formDataState.refNumber} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="totalPrice" placeholder="Total Price (₹)" value={formDataState.totalPrice} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="squareMeters" placeholder="Square Meters" value={formDataState.squareMeters} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="zip" placeholder="ZIP Code" value={formDataState.zip} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="place" placeholder="Place" value={formDataState.place} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="city" placeholder="City" value={formDataState.city} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="country" placeholder="Country" value={formDataState.country} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="rooms" placeholder="Rooms" value={formDataState.rooms} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="bathrooms" placeholder="Bathrooms" value={formDataState.bathrooms} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="type" placeholder="Type (e.g., Apartment, Villa)" value={formDataState.type} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="amenities" placeholder="Amenities (comma separated)" value={formDataState.amenities} onChange={handleChange} className="border p-2 rounded col-span-2" />
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" placeholder="Enter property description" value={formDataState.description} onChange={handleChange} rows={4} className="border p-2 rounded w-full" />
      </div>

      {/* Boolean Features */}
      <div className="flex gap-6 mt-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="pool" checked={formDataState.pool} onChange={handleChange} />
          Pool
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="parking" checked={formDataState.parking} onChange={handleChange} />
          Parking
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="garden" checked={formDataState.garden} onChange={handleChange} />
          Garden
        </label>
      </div>

      {/* Existing images (edit mode) */}
      {editingProperty && existingImages.length > 0 && (
        <div className="mt-4">
          <label className="block mb-1 font-medium">Existing Images — remove to delete</label>
          <div className="grid grid-cols-4 gap-3">
            {existingImages.map((url, idx) => (
              <div key={url} className="relative">
                <img src={url} alt={`existing-${idx}`} className="w-full h-28 object-cover rounded" />
                <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload */}
      <div className="mt-4">
        <label className="block mb-1 font-medium">Upload Images</label>
        <input type="file" multiple onChange={handleImageChange} accept="image/*" className="border p-2 rounded w-full" />
      </div>

      {/* Preview for newly added images */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-3">
          {previewImages.map((src, idx) => (
            <div key={src} className="relative">
              <img src={src} alt={`preview-${idx}`} className="w-full h-32 object-cover rounded" />
              <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-1 right-1 bg-white/80 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
            </div>
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
}
