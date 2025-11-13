import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import properties from "../data/properties";
import PropertyCard from "../components/PropertyCard";
import { ArrowLeft } from "lucide-react";

const PropertyListPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // normalize for matching
  const normalized = category.toLowerCase().replace(/\s+/g, "-");

  const filteredProperties = properties.filter((p) => {
    const citySlug = p.city.toLowerCase().replace(/\s+/g, "-");
    const typeSlug = p.type.toLowerCase().replace(/\s+/g, "-");
    return citySlug === normalized || typeSlug === normalized;
  });

  return (
    <div className="relative">
      {/* 🔙 Floating Back Button — goes to homepage */}
      <button
        aria-label="Go Home"
        onClick={() => navigate("/")}
        className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center 
                   w-12 h-12 rounded-full bg-black text-white shadow-xl 
                   hover:bg-gray-800 transition-all duration-200 focus:outline-none"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-7xl mx-auto px-4 py-28">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {category.replace("-", " ")} Properties
        </h1>

        {filteredProperties.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default PropertyListPage;
