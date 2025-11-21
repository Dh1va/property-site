// src/components/PropertyCard.jsx
import React, { useRef } from "react";
import Slider from "react-slick";
import {
  MapPin,
  Expand,
  Bath,
  Bed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const id = property._id || property.id;
  const price = property.totalPrice ?? property.price ?? 0;
  const size = property.squareMeters ?? property.size ?? 0;
  const rooms = property.rooms ?? property.bedrooms ?? 0;
  const baths = property.bathrooms ?? 0;

  const images = property.images?.length ? property.images : [];

  const sliderSettings = {
    dots: false, // ❌ No dots
    arrows: false, // using custom arrows
    infinite: images.length > 1,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const goToDetails = () => navigate(`/property/${id}`);

  return (
    <div className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* 🖼 Image Slider */}
      <div className="relative">
        {images.length > 0 ? (
          <>
            <Slider ref={sliderRef} {...sliderSettings}>
              {images.map((img, index) => (
                <div
                  key={index}
                  onClick={goToDetails}
                  className="cursor-pointer"
                >
                  <img
                    src={img}
                    alt={property.title}
                    className="w-full h-56 object-cover"
                  />
                </div>
              ))}
            </Slider>

            {/* Custom Arrows - clean without background */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-200 transition"
                >
                  <ChevronLeft className="w-7 h-7 drop-shadow-[0_0_6px_rgba(0,0,0,0.7)] stroke-[3]" />
                </button>

                <button
                  type="button"
                  onClick={() => sliderRef.current?.slickNext()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-200 transition"
                >
                  <ChevronRight className="w-7 h-7 drop-shadow-[0_0_6px_rgba(0,0,0,0.7)] stroke-[3]" />
                </button>
              </>
            )}
          </>
        ) : (
          <div
            className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm cursor-pointer"
            onClick={goToDetails}
          >
            No image available
          </div>
        )}

        {/* Property Type Badge */}
        <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full z-20">
          {property.type}
        </span>
      </div>

      {/* 📍 Info Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-600 text-sm mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {property.city}, {property.country}
          </div>

          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <Expand className="w-4 h-4" /> {size} m²
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {rooms}
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" /> {baths}
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="font-semibold text-lg text-black">
              CHF {Number(price).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex justify-start mt-4">
          <button
            className="cursor-pointer text-sm font-medium text-white bg-black border border-black px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            onClick={goToDetails}
          >
            Discover More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
