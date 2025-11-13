// src/api.js
import axios from "axios";

// ✅ Vite env support
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("🌍 API Base URL =", baseURL);

const api = axios.create({
  baseURL,
});

// Automatically attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
