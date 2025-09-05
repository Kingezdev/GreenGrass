import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const VerificationStatus = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({
    email: 'pending',
    nin: 'pending',
    ownership: 'pending'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching verification status from backend
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setIsLoading(true);
        // API call to your backend
        // const response = await fetch('/api/auth/verification-status/');
        // const data = await response.json();
        
        // Mock data based on user role
        const mockUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData(mockUser);
        
        const mockStatus = {
          email: Math.random() > 0.3 ? 'verified' : 'pending',
          nin: Math.random() > 0.5 ? 'verified' : mockUser.role === 'landlord' ? 'under_review' : 'pending',
          ownership: mockUser.role === 'landlord' ? 'under_review' : 'not_required'
        };
        
        setVerificationStatus(mockStatus);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
        setIsLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  // Get the status badge style
  const getStatusBadge = (status) => {
    const styles = {
      verified: "bg-green-100 text-green-800",
      submitted: "bg-blue-100 text-blue-800",
      under_review: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-gray-100 text-gray-800",
      not_required: "bg-gray-100 text-gray-400",
    };
    return `${styles[status] || styles.pending} px-3 py-1 rounded-full text-xs font-medium`;
  };

  // Get the status text for display
  const getStatusText = (status) => {
    const text = {
      verified: "✓ Verified",
      submitted: "Submitted",
      under_review: "Under Review",
      rejected: "Rejected - Action Needed",
      pending: "Pending",
      not_required: "Not Required",
    };
    return text[status];
  };

  // Get the status description
  const getStatusDescription = (step, status) => {
    const descriptions = {
      email: {
        pending: "Please check your email and click the verification link",
        verified: "Your email has been successfully verified",
        rejected: "Email verification failed. Please try again"
      },
      nin: {
        pending: "Your NIN is pending verification",
        under_review: "Your NIN is being reviewed by our team",
        verified: "Your NIN has been verified successfully",
        rejected: "NIN verification failed. Please contact support"
      },
      ownership: {
        pending: "Please upload proof of ownership documents",
        under_review: "Your documents are being reviewed by our team",
        verified: "Ownership verification completed",
        rejected: "Document verification failed. Please upload again",
        not_required: "Not required for tenants"
      }
    };
    return descriptions[step]?.[status] || "Status update pending";
  };

  const resendEmailVerification = async () => {
    try {
      // await fetch('/api/auth/resend-verification-email/', { method: 'POST' });
      alert("Verification email sent! Please check your inbox.");
    } catch (error) {
      alert("Failed to send verification email. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  const allVerified = verificationStatus.email === 'verified' && 
                     verificationStatus.nin === 'verified' &&
                     (verificationStatus.ownership === 'verified' || 
                      verificationStatus.ownership === 'not_required');

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-sm bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Verification</h2>
        <p className="text-gray-600">
          Complete these verification steps to access all platform features and build trust with other users.
        </p>
      </div>

      {allVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Your account is fully verified! 🎉
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Verification Checklist */}
      <div className="space-y-4 mb-8">
        {/* Email Verification */}
        <div className={`p-4 border rounded-lg ${verificationStatus.email === 'verified' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                verificationStatus.email === 'verified' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {verificationStatus.email === 'verified' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Verification</h3>
                <p className="text-sm text-gray-500">{getStatusDescription('email', verificationStatus.email)}</p>
              </div>
            </div>
            <span className={getStatusBadge(verificationStatus.email)}>
              {getStatusText(verificationStatus.email)}
            </span>
          </div>
          {verificationStatus.email === 'pending' && (
            <div className="mt-3">
              <button
                onClick={resendEmailVerification}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Resend verification email
              </button>
            </div>
          )}
        </div>

        {/* NIN Verification */}
        <div className={`p-4 border rounded-lg ${verificationStatus.nin === 'verified' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                verificationStatus.nin === 'verified' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {verificationStatus.nin === 'verified' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">NIN Verification</h3>
                <p className="text-sm text-gray-500">{getStatusDescription('nin', verificationStatus.nin)}</p>
              </div>
            </div>
            <span className={getStatusBadge(verificationStatus.nin)}>
              {getStatusText(verificationStatus.nin)}
            </span>
          </div>
        </div>

        {/* Ownership Verification (Landlords only) */}
        {userData?.role === 'landlord' && (
          <div className={`p-4 border rounded-lg ${verificationStatus.ownership === 'verified' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationStatus.ownership === 'verified' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {verificationStatus.ownership === 'verified' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0h.01M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Proof of Ownership</h3>
                  <p className="text-sm text-gray-500">{getStatusDescription('ownership', verificationStatus.ownership)}</p>
                </div>
              </div>
              <span className={getStatusBadge(verificationStatus.ownership)}>
                {getStatusText(verificationStatus.ownership)}
              </span>
            </div>
            {verificationStatus.ownership === 'rejected' && (
              <div className="mt-3">
                <button
                  onClick={() => navigate('/upload-documents')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Upload documents again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Verification usually takes 24-48 hours. You can still browse properties, but some features will be limited until verification is complete.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link
          to="/"
          className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 text-center font-medium transition-colors"
        >
          Browse Properties
        </Link>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default VerificationStatus;