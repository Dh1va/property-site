// src/App.jsx
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Public pages
import Buy from "./pages/Buy";
import Contact from "./pages/Contact";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyListPage from "./pages/PropertyListPage";

// Auth pages
import AdminLogin from "./pages/AdminLogin";
import SellerAuth from "./pages/SellerAuth";

// Protected pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddProperty from "./pages/AdminAddProperty";
import AdminSellers from "./pages/AdminSellers";

import SellerDashboard from "./pages/SellerDashboard";

// 🔐 Auth guard to protect routes
const RequireAuth = ({ allowedRole, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // No token → not logged in
  if (!token) return <Navigate to={`/${allowedRole}/login`} replace />;

  // Wrong role → redirect to correct login
  if (role !== allowedRole)
    return <Navigate to={`/${allowedRole}/login`} replace />;

  return children;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* ========= PUBLIC ROUTES ========= */}
        <Route path="/" element={<Buy />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/properties/:category" element={<PropertyListPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* ========= AUTH ROUTES ========= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/seller/login" element={<SellerAuth />} />

        {/* ========= ADMIN PROTECTED ROUTES ========= */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth allowedRole="admin">
              <AdminDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/add"
          element={
            <RequireAuth allowedRole="admin">
              <AdminAddProperty />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/sellers"
          element={
            <RequireAuth allowedRole="admin">
              <AdminSellers />
            </RequireAuth>
          }
        />

        {/* Shortcut: /admin → /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

        {/* ========= SELLER PROTECTED ROUTES ========= */}
        <Route
          path="/seller"
          element={
            <RequireAuth allowedRole="seller">
              <SellerDashboard />
            </RequireAuth>
          }
        />

        {/* Shortcut: /seller/dashboard → /seller */}
        <Route
          path="/seller/dashboard"
          element={<Navigate to="/seller" replace />}
        />

        {/* ========= 404 ========= */}
        <Route
          path="*"
          element={
            <div className="p-8 text-center text-lg text-gray-600">
              404 — Page Not Found
            </div>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
