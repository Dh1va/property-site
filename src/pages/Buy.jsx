import React, { useState, useRef } from "react";
import FilterForm from "../components/FilterForm";
import PropertyList from "../components/PropertyList";
import InfoSection from "../components/InfoSection";
import Enquiry from "../components/Enquiry";

import properties from "../data/properties";

const Buy = () => {
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const propertyListRef = useRef(null); // 👈 Step 1: Create a ref

  const handleFilter = (filters) => {
    // ✅ Empty submit → reset all properties
    if (
      !filters.city &&
      !filters.type &&
      !filters.minBudget &&
      !filters.maxBudget &&
      !filters.minSqm &&
      !filters.maxSqm &&
      !filters.minRooms &&
      !filters.maxRooms &&
      !filters.newItem &&
      (!filters.amenities || filters.amenities.length === 0)
    ) {
      setFilteredProperties(properties);
      return;
    }

    // ✅ Filtering logic
    const filtered = properties.filter((property) => {
      const matchesCity =
        !filters.city ||
        property.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesType =
        !filters.type ||
        property.type.toLowerCase() === filters.type.toLowerCase();
      const matchesMinPrice =
        !filters.minBudget || property.price >= Number(filters.minBudget);
      const matchesMaxPrice =
        !filters.maxBudget || property.price <= Number(filters.maxBudget);
      const matchesMinSqm =
        !filters.minSqm || property.size >= Number(filters.minSqm);
      const matchesMaxSqm =
        !filters.maxSqm || property.size <= Number(filters.maxSqm);
      const matchesMinRooms =
        !filters.minRooms || property.rooms >= Number(filters.minRooms);
      const matchesMaxRooms =
        !filters.maxRooms || property.rooms <= Number(filters.maxRooms);
      const matchesAmenities =
        !filters.amenities.length ||
        filters.amenities.every((a) => property.amenities.includes(a));

      return (
        matchesCity &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinSqm &&
        matchesMaxSqm &&
        matchesMinRooms &&
        matchesMaxRooms &&
        matchesAmenities
      );
    });

    setFilteredProperties(filtered);

    // 👇 Step 3: Scroll down to property list
    setTimeout(() => {
      propertyListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🏠 Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center text-white min-h-[90vh] bg-cover bg-center px-4 pt-32 sm:pt-40 pb-16"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-4xl space-y-6">
          <h1 className="text-3xl sm:text-5xl font-bold">
            Discover Your Dream Property
          </h1>
          <p className="text-lg sm:text-xl text-gray-200">
            Find the perfect home or investment opportunity in Switzerland.
          </p>

          {/* 🧾 Filter Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md w-full text-black text-start">
            <FilterForm onFilter={handleFilter} />
          </div>
        </div>
      </section>

      {/* 🏘️ Property List */}
      <div ref={propertyListRef} className="px-4 md:px-12 lg:px-24 xl:px-32 py-12">
        <PropertyList properties={filteredProperties} />
      </div>

      <div className="px-4 md:px-12 lg:px-24 xl:px-32 py-12">
        <InfoSection />
      </div>

      <div style={{ backgroundColor: "#EDEAE3" }} className="py-5">
        <div className="px-4 md:px-12 lg:px-24 xl:px-32 py-12">
          <Enquiry />
        </div>
      </div>
    </div>
  );
};

export default Buy;
