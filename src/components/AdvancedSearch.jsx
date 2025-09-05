// components/AdvancedSearch.jsx
import React, { useState } from 'react';

const AdvancedSearch = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    minArea: '',
    maxArea: '',
    verifiedOnly: false,
    availableNow: false
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'verifiedOnly' || name === 'availableNow') {
        setFilters(prev => ({ ...prev, [name]: checked }));
      } else {
        // For amenities
        setFilters(prev => ({
          ...prev,
          amenities: checked 
            ? [...prev.amenities, value]
            : prev.amenities.filter(a => a !== value)
        }));
      }
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      minArea: '',
      maxArea: '',
      verifiedOnly: false,
      availableNow: false
    });
    onReset();
  };

  const propertyTypes = [
    { value: '', label: 'Any Type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'studio', label: 'Studio' },
    { value: 'condo', label: 'Condominium' }
  ];

  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1 Bed' },
    { value: '2', label: '2 Beds' },
    { value: '3', label: '3 Beds' },
    { value: '4', label: '4+ Beds' }
  ];

  const bathroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1 Bath' },
    { value: '2', label: '2 Baths' },
    { value: '3', label: '3+ Baths' }
  ];

  const amenitiesList = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'parking', label: 'Parking' },
    { value: 'security', label: 'Security' },
    { value: 'generator', label: 'Generator' },
    { value: 'water', label: '24/7 Water' },
    { value: 'furniture', label: 'Furnished' },
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'gym', label: 'Gym' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Search Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show More Filters'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              placeholder="Enter area or city"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price (₦)
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="Min price"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price (₦)
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="Max price"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {bedroomOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <select
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {bathroomOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Area (sqm)
                </label>
                <input
                  type="number"
                  name="minArea"
                  value={filters.minArea}
                  onChange={handleInputChange}
                  placeholder="Min area"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Area (sqm)
                </label>
                <input
                  type="number"
                  name="maxArea"
                  value={filters.maxArea}
                  onChange={handleInputChange}
                  placeholder="Max area"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenitiesList.map(amenity => (
                  <label key={amenity.value} className="flex items-center">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity.value}
                      checked={filters.amenities.includes(amenity.value)}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Verified Properties Only</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="availableNow"
                  checked={filters.availableNow}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Available Now</span>
              </label>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Active Filters Display */}
      {Object.values(filters).some(filter => 
        Array.isArray(filter) ? filter.length > 0 : filter !== '' && filter !== false
      ) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.location && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Location: {filters.location}
              </span>
            )}
            {filters.minPrice && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Min: ₦{filters.minPrice}
              </span>
            )}
            {filters.maxPrice && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Max: ₦{filters.maxPrice}
              </span>
            )}
            {filters.propertyType && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                Type: {propertyTypes.find(t => t.value === filters.propertyType)?.label}
              </span>
            )}
            {filters.bedrooms && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                {bedroomOptions.find(b => b.value === filters.bedrooms)?.label}
              </span>
            )}
            {filters.verifiedOnly && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Verified Only
              </span>
            )}
            {filters.availableNow && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Available Now
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;