// components/DashboardPropertyCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

const DashboardPropertyCard = ({ property, onEdit, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: property.title,
    price: property.price,
    status: property.status
  });

  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      rented: 'bg-blue-100 text-blue-800'
    };
    return styles[status] || styles.inactive;
  };

  const handleQuickEditClick = () => {
    setIsEditing(true);
    setEditFormData({
      title: property.title,
      price: property.price,
      status: property.status
    });
  };

  const handleQuickSave = () => {
    onEdit(property.id, editFormData);
    setIsEditing(false);
  };

  const handleCancelQuickEdit = () => {
    setIsEditing(false);
    setEditFormData({
      title: property.title,
      price: property.price,
      status: property.status
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(property.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          {/* Property Image */}
          <img
            src={property.image}
            alt={property.title}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          
          {/* Property Details */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              // Quick Edit Mode
              <div className="space-y-3">
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-600">₦</span>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleInputChange}
                    className="w-32 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleQuickSave}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelQuickEdit}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 text-xs">{property.location}</p>
                  </div>
                  {property.verified && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      Verified
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="text-green-600 font-bold text-sm mb-2">
                  ₦{formatNumber(property.price)}/year
                </p>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                  {property.area && <span>• {property.area} sqm</span>}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{formatNumber(property.views)}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{formatNumber(property.inquiries)}</div>
                    <div className="text-xs text-gray-500">Inquiries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{property.rating || '0'}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`}>
                    {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/property/${property.id}`}
                      className="text-green-600 hover:text-green-700 text-xs font-medium px-2 py-1 hover:bg-green-50 rounded"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-property/${property.id}`}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={handleDeleteClick}
                      className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />
    </>
  );
};

export default DashboardPropertyCard;