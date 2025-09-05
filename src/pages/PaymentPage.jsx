// pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PaymentInitiation from '../components/PaymentInitiation';
import PaymentProcessing from '../components/PaymentProcessing';
import PaymentSuccess from '../components/PaymentSuccess';
import propertyData from '../data/propertyData';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('initiation');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get property data from propertyData.js
  useEffect(() => {
    const fetchProperty = () => {
      try {
        // Convert id to number since property IDs in propertyData are numbers
        const propertyId = parseInt(id);
        
        // Find the property in the imported propertyData
        const foundProperty = propertyData.find(prop => prop.id === propertyId);
        
        if (foundProperty) {
          // Transform the property data to match the expected format
          const transformedProperty = {
            id: foundProperty.id,
            title: foundProperty.title,
            location: foundProperty.location,
            price: foundProperty.price,
            images: foundProperty.images,
            landlord: foundProperty.landlord,
            bedrooms: foundProperty.bedrooms,
            bathrooms: foundProperty.bathrooms,
            area: foundProperty.area,
            amenities: foundProperty.amenities,
            description: foundProperty.description
          };
          
          setProperty(transformedProperty);
        } else {
          console.error('Property not found');
          navigate('/properties'); // Redirect to properties page if property not found
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property:', err);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handlePaymentInitiation = (details) => {
    setPaymentDetails(details);
    setStep('processing');
  };

  const handlePaymentSuccess = (transactionData) => {
    // Create a transaction object with details
    const newTransaction = {
      id: `TX${Date.now()}`, // This should match what TransactionDetail expects
      transactionId: `TX${Date.now()}`, // Keep this for backward compatibility
      amount: property.price,
      timestamp: new Date().toISOString(),
      propertyId: property.id,
      propertyTitle: property.title,
      status: 'completed',
      paymentMethod: paymentDetails?.paymentMethod || 'card',
      // Add other fields that TransactionDetail might expect
      rentAmount: property.price,
      serviceFee: Math.round(property.price * 0.05), // 5% service fee
      type: 'payment',
      counterparty: property.landlord.name,
      escrowStatus: 'held',
      date: new Date().toISOString(),
      propertyAddress: property.location,
      duration: '12 months', // Default duration
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    };
    
    setTransaction(newTransaction);
    setStep('success');
    
    // Save transaction to localStorage (in a real app, this would be an API call)
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    localStorage.setItem('transactions', JSON.stringify([...existingTransactions, newTransaction]));
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error.message}`);
    setStep('initiation');
  };

  const handleViewTransaction = () => {
    if (transaction) {
      navigate(`/transactions/${transaction.id}`);
    } else {
      navigate('/transactions');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'initiation':
        return (
          <PaymentInitiation
            property={property}
            onProceed={handlePaymentInitiation}
            onCancel={() => navigate(`/property/${id}`)}
          />
        );
      
      case 'processing':
        return (
          <PaymentProcessing
            paymentDetails={paymentDetails}
            property={property}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      
      case 'success':
        return (
          <PaymentSuccess
            transaction={transaction}
            property={property}
            onContinue={handleViewTransaction}
          />
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link
            to="/properties"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Browse Available Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/property/${id}`}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            ← Back to Property
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {step === 'initiation' && 'Secure Payment'}
            {step === 'processing' && 'Processing Payment'}
            {step === 'success' && 'Payment Complete'}
          </h1>
          <p className="text-gray-600">
            {step === 'initiation' && 'Complete your rental payment securely'}
            {step === 'processing' && 'Your payment is being processed'}
            {step === 'success' && 'Your payment was successful'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step !== 'initiation' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step !== 'initiation' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'processing' ? 'bg-green-600 text-white' : 
              step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step === 'success' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Main Content */}
        {renderStep()}

        {/* Security Badge */}
        {step === 'initiation' && (
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure SSL Encryption • Funds Protected by Escrow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;