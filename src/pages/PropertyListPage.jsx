import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import API from "../services/api";
import Breadcrumb from "../components/BreadCrumb";
import CategoryFilterForm from "../components/CategoryFilterForm";

const PropertyListPage = () => {
  const { category } = useParams();

  const [baseProperties, setBaseProperties] = useState([]);       // category results
  const [filteredProperties, setFilteredProperties] = useState([]); // after filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalized = category.toLowerCase().replace(/\s+/g, "-");

  const formattedTitle = category.replace(/-/g, " ");
  const pluralTitle =
    formattedTitle.endsWith("s") ? formattedTitle : formattedTitle + "s";

  useEffect(() => {
    const fetchProps = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/properties");
        const all = res.data || [];

        const categoryProps = all.filter((p) => {
          const citySlug = (p.city || "").toLowerCase().replace(/\s+/g, "-");
          const typeSlug = (p.type || "").toLowerCase().replace(/\s+/g, "-");
          return citySlug === normalized || typeSlug === normalized;
        });

        setBaseProperties(categoryProps);
        setFilteredProperties(categoryProps);
      } catch (err) {
        console.error("Fetch properties error:", err);
        setError(err?.response?.data?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProps();
  }, [normalized]);

  // Handle filters from CategoryFilterForm
  const handleFilter = (filters) => {
    // if nothing selected, reset to category defaults
    if (
      !filters.city &&
      !filters.rooms &&
      (!filters.amenities || filters.amenities.length === 0)
    ) {
      setFilteredProperties(baseProperties);
      return;
    }

    const next = baseProperties.filter((property) => {
      const size = property.squareMeters ?? property.size ?? 0;

      // City / postal search
      const searchCity = (filters.city || "").toLowerCase();
      const locationString = (
        (property.city || "") +
        " " +
        (property.place || "") +
        " " +
        (property.postalCode ||
          property.zipCode ||
          property.zip ||
          property.pincode ||
          "")
      )
        .toString()
        .toLowerCase();

      const matchesCity =
        !searchCity || locationString.includes(searchCity);

      // Rooms (single number, treat as "at least N rooms")
      const matchesRooms =
        !filters.rooms ||
        (property.rooms ?? 0) >= Number(filters.rooms);

      const matchesAmenities =
        !filters.amenities?.length ||
        filters.amenities.every((a) =>
          (property.amenities || []).includes(a)
        );

      return matchesCity && matchesRooms && matchesAmenities;
    });

    setFilteredProperties(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-28">
      
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: pluralTitle }, // current page
        ]}
      />
      {/* Filter (compact, single-row style) */}
      <div className="mb-10">
        <CategoryFilterForm onFilter={handleFilter} />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 capitalize">{pluralTitle}</h1>

      

      {/* Property list */}
      {loading ? (
        <p>Loading properties…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredProperties.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => {
            const id = property._id || property.id;
            return <PropertyCard key={id} property={property} />;
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-lg">
          No properties found for this search in this category.
        </p>
      )}
    </div>
  );
};

export default PropertyListPage;
