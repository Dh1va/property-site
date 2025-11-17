// src/admin/AdminEnquiries.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../components/AuthContext";

export default function AdminEnquiries() {
  const { token } = useContext(AuthContext) || {};
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const fetchEnquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/enquiry"); // GET /api/enquiry
      setEnquiries(res.data);
    } catch (err) {
      console.error("fetch enquiries error:", err);
      setError(err?.response?.data?.message || "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    setDeleting(id);
    try {
      await API.delete(`/enquiry/${id}`);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Enquiries</h1>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      {loading ? (
        <div>Loading…</div>
      ) : enquiries.length === 0 ? (
        <div className="text-gray-500">No enquiries found.</div>
      ) : (
        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left">Ref</th>
                <th className="px-3 py-2 text-left">Property</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Message</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((q) => (
                <tr key={q._id} className="border-b last:border-b-0">
                  <td className="px-3 py-2">{q.refNumber}</td>
                  <td className="px-3 py-2">{q.propertyTitle || "-"}</td>
                  <td className="px-3 py-2">{q.name}</td>
                  <td className="px-3 py-2">{q.email}</td>
                  <td className="px-3 py-2">{q.phone || "-"}</td>
                  <td className="px-3 py-2 max-w-sm break-words">{q.message}</td>
                  <td className="px-3 py-2">{new Date(q.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <button
                      className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                      onClick={() => handleDelete(q._id)}
                      disabled={deleting === q._id}
                    >
                      {deleting === q._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
