// components/PaymentInitiation.jsx
import React, { useState } from 'react';

const PaymentInitiation = ({ property, onProceed, onCancel }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const serviceFee = property.price * 0.05; // 5% service fee
  const totalAmount = property.price + serviceFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    onProceed({
      propertyId: property.id,
      amount: property.price,
      serviceFee,
      totalAmount,
      paymentMethod
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold mb-6">Secure Payment Initiation</h2>
      
      {/* Property Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2">Property Details</h3>
        <p className="text-gray-600">{property.title}</p>
        <p className="text-gray-600">{property.location}</p>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
          <span className="font-semibold">Annual Rent:</span>
          <span className="text-green-600 font-bold">₦{property.price.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">Payment Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Rent Amount:</span>
            <span>₦{property.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee (5%):</span>
            <span>₦{serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2 font-bold">
            <span>Total Amount:</span>
            <span className="text-green-600">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <div className="ml-3">
              <span className="font-medium">Bank Transfer</span>
              <p className="text-sm text-gray-600">Direct bank transfer</p>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <div className="ml-3">
              <span className="font-medium">Debit/Credit Card</span>
              <p className="text-sm text-gray-600">Pay with card</p>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
            <input
              type="radio"
              name="paymentMethod"
              value="wallet"
              checked={paymentMethod === 'wallet'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-green-600 focus:ring-green-500"
            />
            <div className="ml-3">
              <span className="font-medium">Digital Wallet</span>
              <p className="text-sm text-gray-600">PayPal, Apple Pay, etc.</p>
            </div>
          </label>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 text-green-600 focus:ring-green-500"
          />
          <span className="ml-3 text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-green-600 hover:text-green-700">
              Terms and Conditions
            </a>
            {' '}and understand that:
            <ul className="mt-2 space-y-1">
              <li>• Funds will be held in escrow until I confirm move-in</li>
              <li>• I can cancel and get a full refund before move-in confirmation</li>
              <li>• Service fee is non-refundable after move-in</li>
            </ul>
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!agreedToTerms}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentInitiation;