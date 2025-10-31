import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const amenitiesList = [
  "Mountain view", "Lake view", "Pool", "Available for foreigners",
  "Balcony", "Stores", "Terrace", "Kindergarten",
  "Public Transit", "Elevator", "Parking", "Garage",
];

const FilterForm = ({ onFilter }) => {
  const initialFilters = {
    city: "",
    type: "",
    minBudget: "",
    maxBudget: "",
    minSqm: "",
    maxSqm: "",
    minRooms: "",
    maxRooms: "",
    newItem: false,
    amenities: [],
  };

  const [filters, setFilters] = useState(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const toggleAmenity = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleErase = () => {
    setFilters(initialFilters);
    onFilter(initialFilters); // also reset property list in parent
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6"
    >
      {/* 🏙️ Row 1 — Place & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Place</label>
          <input
            type="text"
            placeholder="Enter city or postal code"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Type of Property
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border rounded-md p-2 w-full"
          >
            <option value="">All Types</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="Land">Land</option>
            <option value="Commercial Building">Commercial Building</option>
            
          </select>
        </div>
      </div>

      {/* 💰 Row 2 — Budget, Sqm, Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Budget */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Budget (CHF)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minBudget}
              onChange={(e) =>
                setFilters({ ...filters, minBudget: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxBudget}
              onChange={(e) =>
                setFilters({ ...filters, maxBudget: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>

        {/* Sq.m */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Sq. m.
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minSqm}
              onChange={(e) =>
                setFilters({ ...filters, minSqm: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxSqm}
              onChange={(e) =>
                setFilters({ ...filters, maxSqm: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Number of Rooms
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minRooms}
              onChange={(e) =>
                setFilters({ ...filters, minRooms: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxRooms}
              onChange={(e) =>
                setFilters({ ...filters, maxRooms: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* ✅ Row 3 — New Item + Seek */}
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <input
            type="checkbox"
            checked={filters.newItem}
            onChange={(e) =>
              setFilters({ ...filters, newItem: e.target.checked })
            }
          />
          New Item
        </label>

        <button
          type="submit"
          className="bg-black text-white w-full py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-800 transition text-lg font-medium"
        >
          <Search className="w-5 h-5" />
          Seek
        </button>
      </div>

      {/* ⚙️ Advanced Search + Erase (always visible) */}
      <div className="flex justify-between items-center mt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Search
        </button>

        <button
          type="button"
          onClick={handleErase}
          className="text-sm flex items-center gap-1 text-red-600 hover:text-red-700"
        >
          <X className="w-4 h-4" /> Erase
        </button>
      </div>

      {/* 🧩 Advanced Search Pills */}
      {showAdvanced && (
        <div className="mt-4 flex flex-wrap gap-2">
          {amenitiesList.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                filters.amenities.includes(a)
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-gray-700 hover:border-black"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default FilterForm;
