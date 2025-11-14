// src/utils/apiClient.js
import api from "../api";

export async function getAllProperties() {
  const res = await api.get("/api/properties");
  return res.data;
}

export async function getSellerProperties() {
  const res = await api.get("/api/properties/mine");
  return res.data;
}

export async function getPropertyById(id) {
  const res = await api.get(`/api/properties/${id}`);
  return res.data;
}

export async function createProperty(formData, onUploadProgress) {
  const res = await api.post("/api/properties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return res.data;
}

export async function updateProperty(id, formData, onUploadProgress) {
  const res = await api.put(`/api/properties/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return res.data;
}

export async function deleteProperty(id) {
  const res = await api.delete(`/api/properties/${id}`);
  return res.data;
}
