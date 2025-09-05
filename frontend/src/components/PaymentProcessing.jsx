// components/PaymentProcessing.jsx
import React, { useState, useEffect } from 'react';

const PaymentProcessing = ({ paymentDetails, onSuccess, onError }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('initializing');

  useEffect(() => {
    const simulatePayment = async () => {
      // Simulate payment process
      setStatus('processing');
      
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i);
      }

      setStatus('verifying');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('completing');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate successful payment
      onSuccess({
        transactionId: 'TX' + Date.now(),
        amount: paymentDetails.totalAmount,
        timestamp: new Date().toISOString()
      });
    };

    simulatePayment();
  }, [paymentDetails, onSuccess]);

  const getStatusMessage = () => {
    switch (status) {
      case 'initializing': return 'Initializing payment...';
      case 'processing': return 'Processing payment...';
      case 'verifying': return 'Verifying transaction...';
      case 'completing': return 'Completing transaction...';
      default: return 'Processing...';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
      <p className="text-gray-600 mb-6">{getStatusMessage()}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold">₦{paymentDetails.totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Property:</span>
          <span className="text-sm text-gray-600">#{paymentDetails.propertyId}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Please don't close this window. This may take a few moments...
      </p>
    </div>
  );
};

export default PaymentProcessing;