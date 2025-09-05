// components/PaymentSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = ({ transaction, property, onContinue }) => {
  // Ensure we have a valid transaction object
  if (!transaction) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Transaction Error</h2>
        <p className="text-gray-600 mb-6">No transaction data available</p>
        <Link
          to="/dashboard"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  // Use transaction.id for the URL parameter (not transaction.transactionId)
  const transactionId = transaction.id || transaction.transactionId;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">Your payment has been processed successfully</p>

      {/* Transaction Details */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Transaction ID:</span>
          <span className="font-mono text-sm">{transaction.transactionId || transaction.id}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Amount Paid:</span>
          <span className="font-semibold text-green-600">₦{transaction.amount?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date & Time:</span>
          <span className="text-sm">{new Date(transaction.timestamp).toLocaleString()}</span>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Contact the landlord to schedule move-in</li>
          <li>Confirm move-in through the app when you receive keys</li>
          <li>Funds will be released to landlord after your confirmation</li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/dashboard"
          className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium text-center"
        >
          Go to Dashboard
        </Link>
        <Link
          to={`/transactions/${transactionId}`}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium text-center"
        >
          View Transaction Details
        </Link>
      </div>

      {/* Support Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Need help? Contact support at{' '}
          <a href="mailto:support@naijarent.com" className="text-green-600 hover:text-green-700">
            support@naijarent.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;