import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "tenant",
    password: "",
    confirmPassword: "",
    nin: "",
    terms: false,
    // Landlord specific fields
    proofOfOwnership: null,
    ownershipDocument: "",
    // Tenant specific fields
    employmentStatus: "",
    maritalStatus: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simple validation for file type and size
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          proofOfOwnership: 'File size must be less than 5MB'
        }));
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          proofOfOwnership: 'Please upload a JPEG, PNG, or PDF file'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        proofOfOwnership: file,
        ownershipDocument: file.name
      }));
      
      if (errors.proofOfOwnership) {
        setErrors(prev => ({
          ...prev,
          proofOfOwnership: ''
        }));
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (step === 2) {
      if (!formData.nin.trim()) newErrors.nin = 'NIN is required';
      else if (formData.nin.length !== 11) newErrors.nin = 'NIN must be 11 digits';
      
      if (formData.role === 'landlord') {
        if (!formData.proofOfOwnership) newErrors.proofOfOwnership = 'Proof of ownership is required';
      }
      
      if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Create user object (to be sent to your backend)
        const user = {
          id: Math.floor(Math.random() * 10000),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          verified: false, // Initially unverified until process is complete
          nin: formData.nin,
          // Add role-specific data
          ...(formData.role === 'tenant' ? {
            favorites: [],
            inquiries: [],
            employmentStatus: formData.employmentStatus,
            maritalStatus: formData.maritalStatus
          } : {
            properties: [],
            rating: 0,
            reviews: 0
          })
        };

        // Store user data
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('signupData', JSON.stringify(formData));
        
        setIsLoading(false);
        alert(`Signup successful! Verification process will begin shortly.`);
        navigate('/verification');
      }, 1500);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-600`}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-600`}
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-600`}
                required
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I am a:
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-600`}
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-600`}
                required
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            
            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Next
            </button>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verification Details</h3>
            
            <div>
              <label htmlFor="nin" className="block text-sm font-medium text-gray-700">
                National Identification Number (NIN)
              </label>
              <input
                type="text"
                id="nin"
                name="nin"
                value={formData.nin}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border p-2 ${errors.nin ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-600`}
                placeholder="11-digit NIN"
                required
              />
              {errors.nin && <p className="mt-1 text-sm text-red-600">{errors.nin}</p>}
            </div>
            
            {formData.role === 'landlord' && (
              <div>
                <label htmlFor="proofOfOwnership" className="block text-sm font-medium text-gray-700">
                  Proof of Ownership Document
                </label>
                <div className="mt-1 flex items-center">
                  <label htmlFor="proofOfOwnership" className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2">
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="proofOfOwnership"
                    name="proofOfOwnership"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <span className="text-sm text-gray-500">{formData.ownershipDocument || "No file chosen"}</span>
                </div>
                {errors.proofOfOwnership && <p className="mt-1 text-sm text-red-600">{errors.proofOfOwnership}</p>}
                <p className="mt-1 text-xs text-gray-500">Upload a document that proves property ownership (Deed, Certificate of Occupancy, etc.)</p>
              </div>
            )}
            
            {formData.role === 'tenant' && (
              <>
                <div>
                  <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700">
                    Employment Status
                  </label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Select employment status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                    Marital Status
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Select marital status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the <a href="#" className="text-green-600 hover:text-green-500">Terms and Conditions</a> and <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>
                </label>
                {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Complete Signup"
                )}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {renderStep()}
        </form>
      </div>
    </div>
  );
};

export default Signup;