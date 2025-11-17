// src/components/EnquiryFormPanel.jsx
import React, { useState } from "react";
import API from "../services/api";

/**
 * Dark gradient enquiry panel style suitable for right-side sticky panel.
 *
 * Props:
 * - propertyTitle (optional)
 * - propertyRef (optional)
 */
export default function EnquiryFormPanel({ propertyTitle = "", propertyRef = "" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!form.name || !form.email || !form.message) {
      setStatus("Please fill name, email and message.");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        ...form,
        propertyTitle: propertyTitle || undefined,
        propertyRef: propertyRef || undefined,
      };
      const res = await API.post("/enquiry", payload);
      if (res?.data?.success) {
        setStatus(`Sent — ref ${res.data.refNumber}`);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("Failed to send enquiry.");
      }
    } catch (err) {
      console.error("enquiry send error:", err);
      setStatus(err?.response?.data?.message || "Server error");
    } finally {
      setBusy(false);
    }
  };

  // simple inline SVG icons to avoid extra icon deps
  const IconUser = () => (
    <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 00-3-3.87M4 21v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const IconPhone = () => (
    <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92V21a1 1 0 01-1.11 1 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012 3.11 1 1 0 013 2h4.09a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.24 1L7.7 9.7a12 12 0 005.6 5.6l1.4-1.4a1 1 0 011-.24l3.6 1.2a1 1 0 01.68.95z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const IconMail = () => (
    <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 8l7 5 7-5M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const IconMessage = () => (
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );

  return (
    <div className="rounded-2xl">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white  rounded-2xl shadow-lg">
       

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-white/6 rounded-lg px-3 py-2">
            <IconUser />
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400" />
          </div>

          <div className="flex items-center gap-2 bg-white/6 rounded-lg px-3 py-2">
            <IconPhone />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400" />
          </div>

          <div className="flex items-center gap-2 bg-white/6 rounded-lg px-3 py-2">
            <IconMail />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400" />
          </div>

          <div className="flex items-start gap-2 bg-white/6 rounded-lg px-3 py-2">
            <svg className="w-5 h-5 text-gray-300 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={3} required className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400 resize-none"></textarea>
          </div>

          <button type="submit" disabled={busy} className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition">
            {busy ? "Sending…" : "Send Inquiry"}
          </button>

          {status && <p className="text-sm text-gray-300 mt-2 text-center">{status}</p>}
        </form>
      </div>
    </div>
  );
}
