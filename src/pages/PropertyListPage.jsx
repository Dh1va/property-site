import { useParams } from "react-router-dom";
import properties from "../data/properties";
import PropertyCard from "../components/PropertyCard";

const PropertyListPage = () => {
  const { category } = useParams();

  // normalize for matching
  const normalized = category.toLowerCase().replace(/\s+/g, "-");

  const filteredProperties = properties.filter((p) => {
    const citySlug = p.city.toLowerCase().replace(/\s+/g, "-");
    const typeSlug = p.type.toLowerCase().replace(/\s+/g, "-");
    return citySlug === normalized || typeSlug === normalized;
  });

  return (
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
  );
};

export default PropertyListPage;
