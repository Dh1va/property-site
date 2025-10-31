// src/components/PropertyList.jsx
import React, { useState, useRef, useEffect } from "react";
import PropertyCard from "./PropertyCard";

const PropertyList = ({ properties }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;

  // 🟢 Reference to scroll back to
  const listRef = useRef(null);

  // Pagination calculations
  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = properties.slice(startIndex, startIndex + propertiesPerPage);

  if (!properties.length)
    return <p className="text-center font-bold text-red-500 mt-6 text-2xl">No properties found for this search !</p>;

  // Change page + scroll to top of section
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to property section
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Generate visible page numbers
  const visiblePages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      visiblePages.push(i);
    } else if (
      (i === currentPage - 2 && currentPage > 3) ||
      (i === currentPage + 2 && currentPage < totalPages - 2)
    ) {
      visiblePages.push("...");
    }
  }

  return (
    <div ref={listRef} className="mt-8">
      {/* 🏘️ Property Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* 📄 Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-10">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md border text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-black border-black hover:bg-black hover:text-white transition"
            }`}
          >
            Prev
          </button>

          {/* Numeric Page Buttons */}
          {visiblePages.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-3 py-2 text-gray-400 select-none">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-md border text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-black text-white border-black"
                    : "text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md border text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-black border-black hover:bg-black hover:text-white transition"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
