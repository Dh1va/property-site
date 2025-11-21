// src/admin/ManageProperties.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

/* Small close icon + Modal reused like in ManageSellers */
const CloseIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-600">
            <CloseIcon />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // property object or null
  const [confirmText, setConfirmText] = useState("");
  const [busyDelete, setBusyDelete] = useState(false);

  // search + filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sellerFilter, setSellerFilter] = useState("all");

  // 🔹 PAGINATION state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // change this to match your properties list page size

  const fetchProps = async () => {
    try {
      setLoading(true);
      const res = await API.get("/properties");
      setProperties(res.data || []);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProps();
  }, []);

  const openDeleteModal = (prop) => {
    setDeleteTarget(prop);
    setConfirmText("");
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setConfirmText("");
    setBusyDelete(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (!confirmText) {
      alert("Type 'DELETE' to confirm.");
      return;
    }
    if (confirmText !== "DELETE") {
      alert("To confirm deletion, you must type DELETE in uppercase.");
      return;
    }

    try {
      setBusyDelete(true);
      const id = deleteTarget._id || deleteTarget.id;
      await API.delete(`/properties/${id}`);
      setProperties((p) => p.filter((x) => (x._id || x.id) !== id));
      closeDeleteModal();
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setBusyDelete(false);
    }
  };

  // helper to get display ID and uploader name
  const getDisplayId = (p) =>
    p.refNumber || `PROP-${String(p.id || "").padStart(3, "0") || (p._id || "")}`;

  const getUploaderName = (p) => p.seller?.name || p.uploaderName || "Admin";

  // build seller options from data (including "Admin")
  const sellerOptions = (() => {
    const set = new Set();
    properties.forEach((p) => {
      set.add(getUploaderName(p));
    });
    return Array.from(set).sort();
  })();

  // apply search + filter
  const filteredProperties = properties.filter((p) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    let matchesSearch = true;

    if (normalizedSearch) {
      const title = (p.title || "").toLowerCase();
      const ref = getDisplayId(p).toLowerCase();
      matchesSearch = title.includes(normalizedSearch) || ref.includes(normalizedSearch);
    }

    let matchesSeller = true;
    if (sellerFilter !== "all") {
      matchesSeller = getUploaderName(p) === sellerFilter;
    }

    return matchesSearch && matchesSeller;
  });

  // 🔹 Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sellerFilter]);

  // 🔹 Keep page inside range when list shrinks
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // 🔹 Slice current page items
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = filteredProperties.slice(startIndex, endIndex);

  if (loading) return <div className="p-6">Loading properties…</div>;

  return (
    <div className="p-6">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">All Properties</h2>
        <button
          onClick={() => navigate("/admin/properties/new")}
          className="px-4 py-2 bg-black text-white rounded cursor-pointer self-start md:self-auto"
        >
          Add Property
        </button>
      </div>

      {/* Search + filters row */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by ID or property name..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
            value={sellerFilter}
            onChange={(e) => setSellerFilter(e.target.value)}
          >
            <option value="all">All uploaders</option>
            {sellerOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count info */}
      <div className="text-xs text-gray-500 mb-3 flex flex-wrap gap-2 items-center">
        <span>
          Showing {filteredProperties.length} of {properties.length} properties
        </span>
        {filteredProperties.length > 0 && (
          <span>
            | Page {currentPage} of {totalPages} |{" "}
            {startIndex + 1}–{Math.min(endIndex, filteredProperties.length)} shown
          </span>
        )}
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-gray-500">No properties match your search/filter.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pageItems.map((p) => {
              const id = p._id || p.id;
              const firstImg = p.images?.[0] || "";
              const price = p.totalPrice ?? p.price ?? null;

              const displayId = getDisplayId(p);
              const uploaderName = getUploaderName(p);

              return (
                <div
                  key={id}
                  className="bg-white rounded shadow flex flex-col overflow-hidden"
                >
                  {/* Image as card head (no padding) */}
                  <div className="w-full h-40 bg-gray-100 overflow-hidden">
                    {firstImg ? (
                      <img
                        src={firstImg}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content with padding */}
                  <div className="flex-1 flex flex-col p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-sm text-gray-600">
                        {p.city || p.place || "-"}, {p.country || "-"}
                      </p>

                      {/* ID + uploader info */}
                      <p className="text-xs text-gray-500 mt-1">
                        ID: <span className="font-mono">{displayId}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded by:{" "}
                        <span className="font-semibold">{uploaderName}</span>
                      </p>

                      <p className="mt-2 font-semibold">
                        {price !== null
                          ? `CHF ${Number(price).toLocaleString()}`
                          : "-"}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/properties/${id}`)}
                        className="px-3 py-1 border rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(p)}
                        className="px-3 py-1 border rounded text-red-600 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🔹 Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
              >
                Previous
              </button>
              <span>
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* DELETE confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={closeDeleteModal}
        title="Delete Property"
      >
        <div className="space-y-3">
          <div className="text-sm">
            This will permanently delete the property
            {deleteTarget?.title ? (
              <>
                {" "}
                <span className="font-semibold">"{deleteTarget.title}"</span>
              </>
            ) : null}
            . This action cannot be undone.
          </div>
          <div className="text-sm">
            To confirm, type <strong>DELETE</strong> below.
          </div>
          <input
            className="w-full border p-2 rounded"
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          <div className="flex items-center gap-3 mt-2">
            <button
              disabled={busyDelete}
              onClick={confirmDelete}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              {busyDelete ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={closeDeleteModal}
              className="px-3 py-2 border rounded"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
