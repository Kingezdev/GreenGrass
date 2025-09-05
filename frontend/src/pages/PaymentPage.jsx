// pages/PaymentPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PaymentInitiation from '../components/PaymentInitiation';
import PaymentProcessing from '../components/PaymentProcessing';
import PaymentSuccess from '../components/PaymentSuccess';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('initiation');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [transaction, setTransaction] = useState(null);

  // Mock property data - replace with API call
  const property = {
    id: 1,
    title: "Modern 3-Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: 1800000,
    landlord: {
      name: "Adebola Johnson",
      verified: true
    }
  };

  const handlePaymentInitiation = (details) => {
    setPaymentDetails(details);
    setStep('processing');
  };

  const handlePaymentSuccess = (transactionData) => {
    setTransaction(transactionData);
    setStep('success');
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error.message}`);
    setStep('initiation');
  };

  const handleViewTransaction = () => {
    navigate('/transactions');
  };

  const renderStep = () => {
    switch (step) {
      case 'initiation':
        return (
          <PaymentInitiation
            property={property}
            onProceed={handlePaymentInitiation}
            onCancel={() => navigate('/dashboard')}
          />
        );
      
      case 'processing':
        return (
          <PaymentProcessing
            paymentDetails={paymentDetails}
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