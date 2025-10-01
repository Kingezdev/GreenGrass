// src/pages/PropertiesPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import { useProperties } from "../context/PropertyContext";
import HandleLoading from "../utils/HandleLoading";
import { HiLocationMarker } from "react-icons/hi";
import { FaBlender } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

const PropertiesPage = () => {
    const { properties, loading } = useProperties();

    return (
      <HandleLoading loading={loading}>
        <div className="">
          <div className="og-bg og-p space-y-7">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl lg:text-3xl font-semibold">Explore Properties</h1>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="mt-1.5 w-5 h-5 text-gray-600 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Browse and discover available properties here.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              
              {properties.length === 0 ? (
                
                <p>No properties available.</p>
                ) : (
                properties.map((property) => (
                  <Link
                    to={`/properties/${property.id}`} // dynamically link to property details page
                    className=""
                  >
                    <div
                      key={property.id}
                      className="rounded-2xl p-3 flex flex-col justify-between bg-white space-y-3 hover:shadow-lg transition hover:-translate-y-1 duration-200 cursor-pointer"
                    >
                      <div className="rounded-xl w-full h-38 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {property.image}
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-sm font-semibold">
                            {property.title.length > 15 ? `${property.title.slice(0, 15)}...` : property.title}
                          </h2>
                          <p className="text-gray-600 flex items-center text-sm gap-1">
                            <HiLocationMarker />{' '}
                            {property.location.length > 15 ? `${property.location.slice(0, 15)}...` : property.location}
                          </p>
                        </div>
                        
                        <p className="text-green-700 font-semibold text-xl">
                          ${formatPrice(property.price, { thousand: 1000, million: 1_000_000, decimals: 1 })}
                        </p>
                      </div>
                      <div className="flex justify-around text-xs text-gray-900">
                        <p className="flex gap-2 bg-gray-200 rounded-full px-2.5 py-1.5 items-center">
                          <FaBlender />
                          {property.bedrooms}
                        </p>
                        <p className="flex gap-2 bg-gray-200 rounded-full px-2.5 py-1.5 items-center">
                          <FaBlender />
                          {property.bathrooms}
                        </p>
                        <p className="flex gap-2 bg-gray-200 rounded-full px-2.5 py-1.5 items-center">
                          <FaBlender />
                          {property.area_sqft} sqft
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </HandleLoading>
    );
};

export default PropertiesPage;