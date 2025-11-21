import React, { useState, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import API from "../services/api";

const amenitiesList = [
  "Garden",
  "Pool",
  "Balcony",
  "Terrace",
  "Public Transit",
  "Elevator",
  "Parking",
  "Garage",
];

const CategoryFilterForm = ({ onFilter }) => {
  const initialFilters = {
    city: "",
    rooms: "",
    amenities: [],
  };

  const [filters, setFilters] = useState(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setLocationSuggestions([]);
    onFilter(initialFilters);
  };

  const fetchLocations = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 1) {
      setLocationSuggestions([]);
      setLocationLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLocationLoading(true);
        const res = await API.get("/locations", {
          params: { search: trimmed },
        });
        setLocationSuggestions(res.data || []);
      } catch (err) {
        console.error("Location fetch failed", err);
        setLocationSuggestions([]);
      } finally {
        setLocationLoading(false);
      }
    }, 300);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, city: value }));
    fetchLocations(value);
  };

  const handleLocationSelect = (item) => {
    setFilters((prev) => ({
      ...prev,
      city: item.city || "",
    }));
    setLocationSuggestions([]);
  };

  const toggleAmenity = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-4 rounded-2xl space-y-4"
    >
      {/* Top row: city + buttons in one line */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* City */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="City or postal code"
            value={filters.city}
            onChange={handleCityChange}
            className="w-full border rounded-full px-4 py-2 text-sm md:text-base pr-10"
            autoComplete="off"
          />

          {/* Suggestions dropdown */}
          {filters.city && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto z-50 mt-1">
              {locationLoading && (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Searching…
                </div>
              )}

              {!locationLoading &&
                locationSuggestions.length > 0 &&
                locationSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleLocationSelect(item)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  >
                    {item.postalCode
                      ? `${item.postalCode} – ${item.city}`
                      : item.city}
                  </div>
                ))}

              {!locationLoading && locationSuggestions.length === 0 && (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  No suggestions found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Advanced</span>
          </button>

          {/* Clear button */}
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <X className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Search button – icon only */}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-black text-white p-2.5 hover:bg-gray-800 cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Advanced Section */}
      {showAdvanced && (
        <div className="space-y-4">
          {/* Rooms + amenities on same row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Short rooms field */}
            <input
              type="number"
              min="0"
              placeholder="Rooms"
              value={filters.rooms}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  rooms: e.target.value,
                }))
              }
              className="border rounded-full px-4 py-2 w-24"
            />

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm border transition ${
                    filters.amenities.includes(a)
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default CategoryFilterForm;
