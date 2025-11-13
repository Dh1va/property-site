import React from "react";
import { MapPin, Expand, Bath, Bed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  return (
    <div className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* 🏡 Image Section */}
      <div className="relative">
        <img
          onClick={() => navigate(`/property/${property.id}`)}
          src={property.images?.[0]}
          alt={property.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Floating Type Tag */}
        <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {property.type}
        </span>
      </div>

      {/* 🏠 Info Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Title & Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {property.city}, {property.country}
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <Expand className="w-4 h-4" /> {property.size} m²
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {property.rooms}
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" /> {property.bathrooms || 2}
            </div>
          </div>

          {/* Price */}
          <div className="pt-2 border-t">
            <p className="font-semibold text-lg text-black">
              INR {property.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 🔘 Discover More Button */}
        <div className="flex justify-start mt-4 ">
          <button
            className=" cursor-pointer text-sm font-medium text-white bg-black border border-black px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            onClick={() => navigate(`/property/${property.id}`)} // You can replace this later with navigation
          >
            Discover More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
