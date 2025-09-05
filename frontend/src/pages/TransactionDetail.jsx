// pages/TransactionDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import propertyData from '../data/propertyData';

const TransactionDetail = () => {
  const [transaction, setTransaction] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    // Get transactions from localStorage
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Find the transaction by ID
    const foundTransaction = storedTransactions.find(tx => tx.id === id);
    
    if (foundTransaction) {
      setTransaction(foundTransaction);
      
      // Find the property in propertyData.js using propertyId
      const foundProperty = propertyData.find(prop => prop.id === foundTransaction.propertyId);
      if (foundProperty) {
        setProperty(foundProperty);
      }
    }
    
    setLoading(false);
  }, [id]);

  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Transaction Not Found</h1>
          <p className="text-gray-600 mb-6">
            The transaction with ID "{id}" could not be found. This might be because:
          </p>
          <ul className="text-left text-gray-600 mb-6 list-disc pl-5">
            <li>The transaction ID is incorrect</li>
            <li>The transaction has been deleted</li>
            <li>You haven't made any transactions yet</li>
          </ul>
          <Link 
            to="/transactions" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            ← Back to All Transactions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/transactions" className="text-green-600 hover:text-green-700 text-sm font-medium">
                ← Back to All Transactions
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Transaction Details</h1>
              <p className="text-gray-600">ID: {transaction.id}</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
              Download Receipt
            </button>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Property</h3>
              <p className="text-gray-900">{transaction.propertyTitle}</p>
              <p className="text-sm text-gray-600">{transaction.propertyAddress || property?.location || 'N/A'}</p>
              {property && (
                <Link 
                  to={`/property/${property.id}`}
                  className="text-green-600 hover:text-green-700 text-sm font-medium mt-1 inline-block"
                >
                  View Property Details
                </Link>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Lease Duration</h3>
              <p className="text-gray-900">{transaction.duration || 'N/A'}</p>
              <p className="text-sm text-gray-600">
                {formatDate(transaction.startDate)} - {formatDate(transaction.endDate)}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Amount</h3>
              <p className="text-2xl font-bold text-green-600">₦{formatNumber(transaction.amount)}</p>
              {transaction.rentAmount && transaction.serviceFee && (
                <p className="text-sm text-gray-600">
                  Rent: ₦{formatNumber(transaction.rentAmount)} + Fee: ₦{formatNumber(transaction.serviceFee)}
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {transaction.status}
              </span>
              {transaction.escrowStatus && (
                <p className="text-sm text-gray-600 mt-1">Escrow: {transaction.escrowStatus}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
              <p className="text-gray-900">
                {transaction.paymentMethod ? transaction.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h3>
              <p className="text-gray-900">{formatDate(transaction.date || transaction.timestamp)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Counterparty</h3>
              <p className="text-gray-900">{transaction.counterparty || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Type</h3>
              <p className="text-gray-900">{transaction.type || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Property Details (if available) */}
        {property && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900">{property.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Specifications</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{property.bedrooms} Bedrooms • {property.bathrooms} Bathrooms</p>
                  {property.area && <p>{property.area} m²</p>}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Landlord</h3>
                <p className="text-gray-900">{property.landlord.name}</p>
                {property.landlord.verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
              Download Receipt
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
              Report Issue
            </button>
            {transaction.status === 'pending' && (
              <button className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 text-sm">
                Cancel Transaction
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;