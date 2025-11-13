import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import properties from "../data/properties";
import Bank1 from "../assets/images/Bank logo-01.png";
import Bank2 from "../assets/images/Bank logo-02.png";
import Bank3 from "../assets/images/Bank logo-03.png";
import Bank4 from "../assets/images/Bank logo-04.png";
import Bank5 from "../assets/images/Bank logo-05.png";
import Bank6 from "../assets/images/Bank logo-06.png";
import {
  MapPin,
  Bath,
  Bed,
  Expand,
  Landmark,
  User,
  Phone,
  Mail,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const property = properties.find((p) => p.id === parseInt(id));
  const [mainImage, setMainImage] = useState(property?.images?.[0] || "");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  if (!property) {
    return (
      <p className="text-center mt-20 text-gray-500">Property not found.</p>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const payload = {
        refNumber: property.refNumber || "N/A",
        propertyTitle: property.title || "N/A",
        ...formData,
      };

      const res = await axios.post("http://localhost:5000/api/enquiry", payload);

      if (res.data.success) {
        setStatus("✅ Inquiry sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("❌ Failed to send inquiry");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Error sending inquiry");
    }
  };

  return (
    <div className="relative">
      {/* 🔙 Floating Back Button — Bottom Right */}
      <button
        aria-label="Go back"
        onClick={() => navigate(-1)}
        className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center 
                   w-12 h-12 rounded-full bg-black text-white shadow-xl 
                   hover:bg-gray-800 transition-all duration-200 focus:outline-none"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 xl:px-32 py-12">
        {/* 🖼️ Main Image */}
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-[500px] object-cover rounded-2xl shadow-lg mb-6 mt-8"
        />

        {/* 🖼️ Thumbnails */}
        <div className="flex gap-4 overflow-x-auto mb-10">
          {property.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Property ${i + 1}`}
              className={`w-32 h-24 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                mainImage === img ? "border-black" : "border-transparent"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        {/* 🏠 Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT — Property Info */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-2 text-gray-800" />
              {property.city}, {property.country}
            </div>

            <div className="flex flex-wrap gap-6 text-gray-700 mb-8">
              <div className="flex items-center gap-2">
                <Expand className="w-5 h-5 text-gray-800" /> {property.size} m²
              </div>
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-gray-800" /> {property.rooms} Rooms
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-gray-800" />{" "}
                {property.bathrooms || 2} Baths
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {property.description}
            </p>

            <div className="text-2xl font-semibold mb-6">
              Price:{" "}
              <span className="text-black">
                CHF {property.price.toLocaleString()}
              </span>
            </div>

            {/* 🏦 Bank Loan Info */}
            <div className="bg-[#EDEAE3] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Landmark className="w-7 h-7 text-black" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Major Banks Loan Available
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get easy financing options through top banks.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-4">
                {[Bank1, Bank2, Bank3, Bank4, Bank5, Bank6].map((bank, i) => (
                  <img
                    key={i}
                    src={bank}
                    alt={`Bank ${i + 1}`}
                    className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition duration-200"
                  />
                ))}
                <span className="text-gray-700 text-sm font-medium italic">
                  and many more leading banks...
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — Inquiry Form */}
          <div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-16 h-16 text-white" />
                <h2 className="text-2xl font-semibold">
                  Interested in this property?
                </h2>
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Share your details and our property expert will get in touch soon.
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 lg:sticky lg:top-28 h-fit"
              >
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 focus-within:ring-2 ring-white/30">
                  <User className="w-5 h-5 text-gray-300" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 focus-within:ring-2 ring-white/30">
                  <Phone className="w-5 h-5 text-gray-300" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 focus-within:ring-2 ring-white/30">
                  <Mail className="w-5 h-5 text-gray-300" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
                  />
                </div>

                <div className="flex items-start gap-2 bg-white/10 rounded-lg px-3 py-2 focus-within:ring-2 ring-white/30">
                  <MessageSquare className="w-5 h-5 text-gray-300 mt-1" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows={3}
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Send Inquiry
                </button>

                {status && (
                  <p className="text-sm text-gray-300 mt-2 text-center">{status}</p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* 🏘️ Related Properties */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.44 1.152-.44 1.591 0L21.75 12M4.5 9.75v10.125a.375.375 0 00.375.375h4.875v-4.125a.375.375 0 01.375-.375h4.5a.375.375 0 01.375.375v4.125h4.875a.375.375 0 00.375-.375V9.75"
              />
            </svg>
            You May Also Like
          </h3>

          <p className="text-gray-600 mb-8">
            Explore more beautiful properties similar to this one.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties
              .filter((p) => p.id !== property.id)
              .slice(0, 3)
              .map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                        {p.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {p.city}, {p.country}
                      </p>
                      <p className="text-gray-800 font-semibold mb-3">
                        INR {p.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/property/${p.id}`)}
                      className="cursor-pointer mt-auto px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition self-start"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
