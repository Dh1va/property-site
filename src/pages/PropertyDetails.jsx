// src/pages/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EnquiryFormPanel from "../components/EnquiryFormPanel";
import API from "../services/api";

import Slider from "react-slick"; // ✅ NEW

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
  MessageSquare,
} from "lucide-react";

import Breadcrumb from "../components/BreadCrumb";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const computeDisplayId = (p) => {
    if (!p) return "";
    if (p.refNumber) return p.refNumber;
    if (p.id) return `PROP-${String(p.id).padStart(3, "0")}`;
    if (p._id) return `PROP-${p._id.slice(-6).toUpperCase()}`;
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Single property
        const res = await API.get(`/properties/${id}`);
        const prop = res.data;
        setProperty(prop);
        setMainImage(prop.images?.[0] || "");

        // Related properties (same type or city, different id)
        try {
          const allRes = await API.get("/properties");
          const all = allRes.data || [];
          const relatedProps = all
            .filter((p) => (p._id || p.id) !== (prop._id || prop.id))
            .filter(
              (p) =>
                p.type === prop.type ||
                (p.city && prop.city && p.city === prop.city)
            )
            .slice(0, 3);
          setRelated(relatedProps);
        } catch (relErr) {
          console.error("Fetch related properties error:", relErr);
        }
      } catch (err) {
        console.error("Fetch property error:", err);
        setError(err?.response?.data?.message || "Property not found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20">Loading property…</p>;
  }

  if (error || !property) {
    return (
      <p className="text-center mt-20 text-gray-500">
        {error || "Property not found."}
      </p>
    );
  }

  const propertyIdDisplay = computeDisplayId(property);
  const price = property.totalPrice ?? property.price ?? 0;
  const size = property.squareMeters ?? property.size ?? 0;
  const rooms = property.rooms ?? property.bedrooms ?? 0;
  const baths = property.bathrooms ?? 0;

  const typeLabel = property.type || "Property";
  const titleLabel = property.title || "Details";

  // ✅ Slider config for mobile related section
  const relatedSliderSettings = {
    dots: true,
    arrows: false,
    infinite: related.length > 1,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-12 md:pt-32">
        {/* Breadcrumb visible below navbar */}
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            {
              label: property.type,
              path: `/properties/${property.type
                ?.toLowerCase()
                .replace(/\s+/g, "-")}`,
            },
            { label: property.title },
          ]}
        />

        {/* Property Title on Top (no ID here) */}
        <h1 className="text-3xl font-bold mt-2 mb-4">{property.title}</h1>

        {/* Main Image */}
        {mainImage && (
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-[500px] object-cover rounded-2xl shadow-lg mb-6"
          />
        )}

        {/* Thumbnails */}
        {property.images?.length > 1 && (
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
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-2 text-gray-800" />
              {property.city}, {property.country}
            </div>

            <div className="flex flex-wrap gap-6 text-gray-700 mb-8">
              <div className="flex items-center gap-2">
                <Expand className="w-5 h-5 text-gray-800" /> {size} m²
              </div>
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-gray-800" /> {rooms} Rooms
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-gray-800" /> {baths || 2} Baths
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {property.description}
            </p>

            <div className="text-2xl font-semibold mb-6">
              Price:{" "}
              <span className="text-black">
                CHF {Number(price).toLocaleString()}
              </span>
            </div>

            {/* Bank info */}
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

          {/* RIGHT – Enquiry */}
          <div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-16 h-16 text-white" />
                <h2 className="text-2xl font-semibold">
                  Interested in this property?
                </h2>
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Share your details and our property expert will get in touch
                soon.
              </p>

              <EnquiryFormPanel
                propertyTitle={property.title}
                propertyRef={propertyIdDisplay}
              />
            </div>
          </div>
        </div>

        {/* Related */}
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

          {related.length ? (
            <>
              {/* 📱 Mobile: slider */}
              <div className="block md:hidden">
                <Slider {...relatedSliderSettings}>
                  {related.map((p) => {
                    const relId = p._id || p.id;
                    const relPrice = p.totalPrice ?? p.price ?? 0;
                    return (
                      <div key={relId} className="px-1">
                        <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full">
                          <img
                            src={p.images?.[0]}
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
                                CHF {Number(relPrice).toLocaleString()}
                              </p>
                            </div>

                            <button
                              onClick={() => navigate(`/property/${relId}`)}
                              className="cursor-pointer mt-auto px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition self-start"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>

              {/* 💻 Desktop / Tablet: grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => {
                  const relId = p._id || p.id;
                  const relPrice = p.totalPrice ?? p.price ?? 0;
                  return (
                    <div
                      key={relId}
                      className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full"
                    >
                      <img
                        src={p.images?.[0]}
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
                            CHF {Number(relPrice).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/property/${relId}`)}
                          className="cursor-pointer mt-auto px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition self-start"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              No related properties available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
