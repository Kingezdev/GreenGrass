// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import TenantRegister from "../components/Register/TenantRegister";
import LandlordRegister from "../components/Register/LandlordRegister";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    user_type: "",
    phone_number: "",
    tenant: { bio: "" },
    landlord: {
      phone_number: "",
      property_name: "",
      years_experience: "",
      website: "",
      location: "",
      bio: "",
    },
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [bpView, setBpView] = useState("day");
  const [bpMonth, setBpMonth] = useState(new Date().getMonth());
  const [bpYear, setBpYear] = useState(new Date().getFullYear());
  const [bpSelected, setBpSelected] = useState(null);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const daysInMonth = new Date(bpYear, bpMonth + 1, 0).getDate();
  const firstDayIndex = new Date(bpYear, bpMonth, 1).getDay();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, phone_number: cleaned }));
  };

  const handleLandlordPhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, phone_number: cleaned },
    }));
  };

  const handleTenantBioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tenant: { ...prev.tenant, bio: e.target.value },
    }));
  };

  const handleLandlordBioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, bio: e.target.value },
    }));
  };

  const handlePropertyNameChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, property_name: e.target.value },
    }));
  };

  const handleLocationChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, location: e.target.value },
    }));
  };

  const handleWebsiteChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, website: e.target.value },
    }));
  };

  const formatISO = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const handlePickDay = (day) => {
    setBpSelected(formatISO(bpYear, bpMonth, day));
    setFormData((prev) => ({ ...prev, birthday: formatISO(bpYear, bpMonth, day) }));
  };

  const handlePrevMonth = () => {
    if (bpMonth === 0) {
      setBpMonth(11);
      setBpYear((prev) => prev - 1);
    } else {
      setBpMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (bpMonth === 11) {
      setBpMonth(0);
      setBpYear((prev) => prev + 1);
    } else {
      setBpMonth((prev) => prev + 1);
    }
  };

  const handleSelectMonth = (monthIndex) => {
    setBpMonth(monthIndex);
    setBpView("day");
  };

  const handleSelectYear = (year) => {
    setBpYear(year);
    setBpView("day");
  };

  const handleBack = () => setStep((prev) => prev - 1);
  const handleNext = () => setStep((prev) => prev + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setErrors(err);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </>
        )}

        {step === 3 && (
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">Select Role</option>
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
          </select>
        )}

        {formData.user_type === "tenant" && (
          <TenantRegister
            step={step}
            formData={formData}
            errors={errors}
            handlePhoneNumberChange={handlePhoneNumberChange}
            handleTenantBioChange={handleTenantBioChange}
            bpView={bpView}
            setBpView={setBpView}
            bpMonth={bpMonth}
            bpYear={bpYear}
            bpSelected={bpSelected}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            handlePickDay={handlePickDay}
            handleSelectMonth={handleSelectMonth}
            handleSelectYear={handleSelectYear}
            monthNames={monthNames}
            firstDayIndex={firstDayIndex}
            daysInMonth={daysInMonth}
            handleBack={handleBack}
            handleNext={handleNext}
            setFormData={setFormData}
            formatISO={formatISO}
            setErrors={setErrors}
          />
        )}

        {formData.user_type === "landlord" && (
          <LandlordRegister
            step={step}
            formData={formData}
            errors={errors}
            handleLandlordPhoneChange={handleLandlordPhoneChange}
            handlePropertyNameChange={handlePropertyNameChange}
            handleLocationChange={handleLocationChange}
            handleWebsiteChange={handleWebsiteChange}
            handleLandlordBioChange={handleLandlordBioChange}
            handleChange={handleChange}
          />
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg bg-gray-200 px-4 py-2"
            >
              Back
            </button>
          )}
          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto rounded-lg bg-green-600 text-white px-4 py-2"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto rounded-lg bg-green-600 text-white px-4 py-2"
            >
              Register
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Register;
