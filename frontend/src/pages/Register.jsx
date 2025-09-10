// src/pages/Register.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
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
    phone_number: "",
    user_type: "tenant", // default
    tenant: { date_of_birth: "", bio: "" },
    landlord: {
      phone_number: "",
      property_name: "",
      years_experience: "",
      website: "",
      bio: "",
      location: "",
    },
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [bpView, setBpView] = useState("year"); 
  const [bpMonth, setBpMonth] = useState(new Date().getMonth());
  const [bpYear, setBpYear] = useState(new Date().getFullYear());
  const [bpSelected, setBpSelected] = useState(new Date());
  const [bgStyle, setBgStyle] = useState({ width: 0, left: 0 });

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  useEffect(() => {
    let ref;
    if (bpView === "day") ref = dayRef.current;
    else if (bpView === "month") ref = monthRef.current;
    else if (bpView === "year") ref = yearRef.current;

    if (ref) {
      setBgStyle({ width: ref.offsetWidth, left: ref.offsetLeft });
    }
  }, [bpView]);

  // compute maxStep based on selected role
  const maxStep = formData.user_type === "landlord" ? 8 : 7;

  // general handleChange keeps your logic intact
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("tenant.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        tenant: { ...prev.tenant, [key]: value },
      }));
    } else if (name.startsWith("landlord.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        landlord: { ...prev.landlord, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // phone (top-level tenant phone) - restrict to digits and max 11
  const handlePhoneNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, phone_number: val }));
  };

  // landlord phone - restrict digits max 11
  const handleLandlordPhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, phone_number: val },
    }));
  };

  // tenant bio - limit 200 chars and show counter
  const handleTenantBioChange = (e) => {
    const val = e.target.value.slice(0, 200);
    setFormData((prev) => ({ ...prev, tenant: { ...prev.tenant, bio: val } }));
  };

  // landlord bio
  const handleLandlordBioChange = (e) => {
    const val = e.target.value.slice(0, 200);
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, bio: val },
    }));
  };

  // property name (max 50)
  const handlePropertyNameChange = (e) => {
    const val = e.target.value.slice(0, 50);
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, property_name: val },
    }));
  };

  // location (max 50)
  const handleLocationChange = (e) => {
    const val = e.target.value.slice(0, 50);
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, location: val },
    }));
  };

  // website: allow only URL-safe characters while typing/pasting;
  // final validation (in validateStep) will require http(s)://
  const handleWebsiteChange = (e) => {
    // Allow characters common in URLs only
    const filtered = e.target.value.replace(
      /[^A-Za-z0-9\-._~:\/?#\[\]@!$&'()*+,;=%]/g,
      ""
    );
    setFormData((prev) => ({
      ...prev,
      landlord: { ...prev.landlord, website: filtered },
    }));
  };

  // Password fields: use normal handleChange but prevent super-long strings (optional)
  const handlePasswordChange = (e) => {
    // limit to 256 chars to be safe
    const val = e.target.value.slice(0, 25);
    setFormData((prev) => ({ ...prev, [e.target.name]: val }));
  };

  // Initialize birthday picker from formData if present
  useEffect(() => {
    const dob = formData.tenant?.date_of_birth;
    if (dob) {
      // expect YYYY-MM-DD
      const parts = dob.split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const dt = new Date(y, m, d);
        if (!isNaN(dt)) {
          setBpSelected(dt);
          setBpMonth(m);
          setBpYear(y);
        }
      }
    }
  }, [formData.tenant.date_of_birth]);

  // Helper: format YYYY-MM-DD
  const formatISO = (d) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Helper: get days in month
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

  // Helper: first day index (0 = Sunday)
  const firstDayIndex = (y, m) => new Date(y, m, 1).getDay();

  // Click a day in calendar
  const handlePickDay = (day) => {
    const d = new Date(bpYear, bpMonth, day);
    setBpSelected(d);
    // set into formData tenant.date_of_birth as YYYY-MM-DD
    setFormData((prev) => ({
      ...prev,
      tenant: { ...prev.tenant, date_of_birth: formatISO(d) },
    }));
  };

  // Navigate months
  const handlePrevMonth = () => {
    let m = bpMonth - 1;
    let y = bpYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    setBpMonth(m);
    setBpYear(y);
  };
  const handleNextMonth = () => {
    let m = bpMonth + 1;
    let y = bpYear;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setBpMonth(m);
    setBpYear(y);
  };

  // When selecting month from month view
  const handleSelectMonth = (m) => {
    setBpMonth(m);
    setBpView("day");
  };

  // When selecting year from year view
  const handleSelectYear = (y) => {
    setBpYear(y);
    setBpView("month");
  };

  // step validation - updated for new step mapping
  const validateStep = () => {
    let newErrors = {};

    // STEP 1: Names
    if (step === 1) {
      if (!formData.first_name) newErrors.first_name = "First name is required";
      if (!formData.last_name) newErrors.last_name = "Last name is required";
    }

    // STEP 2: Email + Password
    if (step === 2) {
      if (!formData.email) newErrors.email = "Email is required";

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        }

        if (/^\d+$/.test(formData.password)) {
          newErrors.password = "Password cannot be entirely numeric";
        }

        const lowered = formData.password.toLowerCase();
        if (
          formData.first_name &&
          lowered.includes(formData.first_name.toLowerCase())
        ) {
          newErrors.password = "Password is too similar to your first name";
        }
        if (
          formData.last_name &&
          lowered.includes(formData.last_name.toLowerCase())
        ) {
          newErrors.password = "Password is too similar to your last name";
        }
        if (
          formData.email &&
          lowered.includes(formData.email.split("@")[0].toLowerCase())
        ) {
          newErrors.password = "Password is too similar to your email";
        }
      }

      if (formData.password2 !== formData.password) {
        newErrors.password2 = "Passwords do not match";
      }
    }


    // STEP 3: Role selection
    if (step === 3) {
      if (!formData.user_type) newErrors.user_type = "Role is required";
    }

    // TENANT FLOW
    if (formData.user_type === "tenant") {
      if (step === 4) {
        if (!formData.phone_number) {
          newErrors.phone_number = "Phone number is required";
        } else if (!/^\d{1,11}$/.test(formData.phone_number)) {
          newErrors.phone_number =
            "Phone number must be numbers only, max 11 digits";
        }
      }

      if (step === 5) {
        if (!formData.tenant.date_of_birth) {
          newErrors["tenant.date_of_birth"] = "Date of birth is required";
        }
      }

      if (step === 6) {
        if (!formData.tenant.bio) {
          newErrors["tenant.bio"] = "Bio is required";
        } else if (formData.tenant.bio.length > 200) {
          newErrors["tenant.bio"] = "Bio cannot exceed 200 characters";
        }
      }

      // step 7 is confirmation for tenant — no extra checks here
    }

    // LANDLORD FLOW
    if (formData.user_type === "landlord") {
      if (step === 4) {
        if (!formData.landlord.phone_number) {
          newErrors["landlord.phone_number"] = "Phone number is required";
        } else if (!/^\d{1,11}$/.test(formData.landlord.phone_number)) {
          newErrors["landlord.phone_number"] =
            "Phone number must be numbers only, max 11 digits";
        }
      }

      if (step === 5) {
        if (!formData.landlord.property_name) {
          newErrors["landlord.property_name"] = "Property name is required";
        } else if (formData.landlord.property_name.length > 50) {
          newErrors["landlord.property_name"] =
            "Property name cannot exceed 50 characters";
        }

        if (!formData.landlord.years_experience) {
          newErrors["landlord.years_experience"] =
            "Years of experience is required";
        }
      }

      if (step === 6) {
        // website and location required on step 6 for landlord per your mapping
        if (!formData.landlord.location) {
          newErrors["landlord.location"] = "Location is required";
        } else if (formData.landlord.location.length > 50) {
          newErrors["landlord.location"] = "Location cannot exceed 50 characters";
        }

        if (!formData.landlord.website) {
          newErrors["landlord.website"] = "Website is required";
        } else if (!/^https?:\/\/.+/.test(formData.landlord.website)) {
          newErrors["landlord.website"] =
            "Website must be a valid URL starting with http:// or https://";
        }
      }

      if (step === 7) {
        if (!formData.landlord.bio) {
          newErrors["landlord.bio"] = "Bio is required";
        } else if (formData.landlord.bio.length > 200) {
          newErrors["landlord.bio"] = "Bio cannot exceed 200 characters";
        }
      }

      // step 8 is confirmation for landlord — no extra checks here
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // go to next step
  const handleNext = () => {
    if (validateStep()) {
      // ensure we don't go past computed maxStep (in case role changed)
      setStep((s) => Math.min(s + 1, maxStep));
    }
  };

  // go back
  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    // keep payload shape exactly as you had it
    let payload = {
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
      first_name: formData.first_name,
      last_name: formData.last_name,
      user_type: formData.user_type,
    };

    if (formData.user_type === "tenant") {
      payload.phone_number = formData.phone_number;
      payload.tenant = formData.tenant;
    } else {
      payload.landlord = formData.landlord;
    }

    try {
      const res = await register(payload);
      setLoading(false);

      if (res.success) {
        navigate("/verify", { state: { email: formData.email } });
      } else {
        setErrors(res.errors || { general: res.error || "Registration failed" });
      }
    } catch (err) {
      setLoading(false);
      setErrors({ general: "Unexpected error. Try again." });
    }
  };

  // month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Render
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div
        className={`w-full ${
            step === 5 ? 'max-w-2xl' : step === maxStep ? 'max-w-2xl' : 'max-w-xl'
          } rounded-2xl bg-white p-4 md:p-6 lg:p-8 shadow-lg`
        }
      >
        {/* Progress Bar */}
        <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${(step / maxStep) * 100}%` }}
          />
        </div>

        {errors.general && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 1: Names */}
          {step === 1 && (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="First Name *"
                value={formData.first_name}
                onChange={handleChange}
                className="
                w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors.first_name && (
                <p className="text-sm text-red-600">{errors.first_name}</p>
              )}
              <input
                type="text"
                name="last_name"
                placeholder="Last Name *"
                value={formData.last_name}
                onChange={handleChange}
                className="
                w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors.last_name && (
                <p className="text-sm text-red-600">{errors.last_name}</p>
              )}
            </>
          )}

          {/* STEP 2: Email + Password */}
          {step === 2 && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

              {/* password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="w-full rounded-lg border px-3 py-2 pr-10 border-gray-300 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}

              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="password2"
                  placeholder="Confirm Password *"
                  value={formData.password2}
                  onChange={handlePasswordChange}
                  className="w-full rounded-lg border px-3 py-2 pr-10 border-gray-300 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2((s) => !s)}
                  className="absolute right-2 top-3 text-gray-500"
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password2 && (
                <p className="text-sm text-red-600">{errors.password2}</p>
              )}
            </>
          )}

          {/* STEP 3: Role selection (buttons) */}
          {step === 3 && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, user_type: "tenant" }))
                }
                className={`flex-1 rounded-lg border px-4 py-3 font-medium ${
                  formData.user_type === "tenant"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Tenant
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, user_type: "landlord" }))
                }
                className={`flex-1 rounded-lg border px-4 py-3 font-medium ${
                  formData.user_type === "landlord"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Landlord
              </button>
              {errors.user_type && (
                <p className="text-sm text-red-600">{errors.user_type}</p>
              )}
            </div>
          )}

          {/* ROLE-SPECIFIC FLOW: TENANT */}
          {formData.user_type === "tenant" && (
            <>
              {step === 4 && (
                <>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number *"
                    value={formData.phone_number}
                    onChange={handlePhoneNumberChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                    inputMode="numeric"
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-red-600">{errors.phone_number}</p>
                  )}
                </>
              )}

              {step === 5 && (
                <>
                <div className="text-lg text-gray-800 mb-1 lg:hidden block">Please select your birthday</div>
                  {/* BIRTHDAY PICKER*/}
                  <div className="flex bgorange-400 p-4 rounded-xl flex-col lg:flex-row gap-6 relative">
                    {/* LEFT: Calendar */}
                    <div className="w-full lg:w-[50%] pm-3 shadomw-sm">
                      {/*Day Month and Year  */}
                      <div
                        className="
                          bg-green-200/60 
                          border border-white/25
                          backdrop-blur-sm  
                          relative py-1.5 text-lg rounded-xl flex gap-3 items-center justify-center  w-full
                        "
                      >
                      {/* Sliding background */}
                      <div
                        className="absolute bg-white rounded-md transition-all duration-300"
                        style={{
                          width: bgStyle.width,
                          left: bgStyle.left,
                          height: "70%", // adjust this as needed
                          top: "15%",    // centers it vertically with spacing above and below
                        }}
                      />

                      {/* Buttons */}
                      <button
                        ref={dayRef}
                        type="button"
                        onClick={() => setBpView("day")}
                        className={`relative px-4 py-1 rounded-md  text-left text-lg transition-colors duration-300 ${
                          bpView === "day" ? "text-green-600 font-semibold" : "text-gray-600"
                        }`}
                      >
                        Day
                      </button>

                      <button
                        ref={monthRef}
                        type="button"
                        onClick={() => setBpView("month")}
                        className={`relative px-4 py-1 rounded-md text-left transition-colors duration-300 ${
                          bpView === "month" ? "text-green-600 font-semibold" : "text-gray-600"
                        }`}
                      >
                        Month
                      </button>

                      <button
                        ref={yearRef}
                        type="button"
                        onClick={() => setBpView("year")}
                        className={`relative px-4 py-1 rounded-md text-left transition-colors duration-300 ${
                          bpView === "year" ? "text-green-600 font-semibold" : "text-gray-600"
                        }`}
                      >
                        Year
                      </button>
                    </div>


                      {/* Month and Year with arrows */}
                      <div className="flex items-center justify-between gap-3 mt-7 mb-5.5">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="rounded-full p-2 hover:bg-gray-100"
                          aria-label="Previous"
                        >
                          <HiChevronLeft className="w-9 h-9 text-green-600" />
                        </button>
                        <div className="px-3 py-1 rounded-md text-lg ">
                          {monthNames[bpMonth]} {bpYear}
                        </div>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="rounded-full p-2 hover:bg-gray-100"
                          aria-label="Next"
                        >
                          <HiChevronRight className="w-9 h-9 text-green-600" />
                        </button>
                      </div>

                      {/* Calendar Body */}
                      <div>
                        {bpView === "day" && (
                          <div>
                            <div className="grid grid-cols-7 gap-2 text-[17px] text-center text-gray-500 mb-2">
                              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                                <div key={d}>{d}</div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                              {/* empty slots */}
                              {Array.from({ length: firstDayIndex(bpYear, bpMonth) }).map((_, i) => (
                                <div key={`e${i}`} className="h-10" />
                              ))}

                              {/* days */}
                              {Array.from({ length: daysInMonth(bpYear, bpMonth) }).map((_, idx) => {
                                const day = idx + 1;
                                const selected =
                                  bpSelected &&
                                  bpSelected.getFullYear() === bpYear &&
                                  bpSelected.getMonth() === bpMonth &&
                                  bpSelected.getDate() === day;
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => handlePickDay(day)}
                                    className={`h-10 rounded-md flex items-center justify-center text-sm font-medium  ${
                                      selected ? "bg-gray-200  text-white hover:bg-gray-100" : "text-gray-700 bg-gray-100"
                                    }`}
                                  >
                                    <span
                                      className={`
                                        w-[83%] h-[83%] rounded-sm flex items-center justify-center text-sm font-medium hover:bg-gray-100 p-2 ${
                                        selected ? "bg-green-600 text-white hover:bg-green-600 " : "text-gray-700 bg-gray-100"
                                      }`}
                                    >
                                      {day}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {bpView === "month" && (
                          <div className="grid grid-cols-3 gap-2">
                            {monthNames.map((m, i) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => handleSelectMonth(i)}
                                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                                  bpMonth === i ? "bg-green-600 text-white" : "text-gray-700"
                                }`}
                              >
                                {m.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        )}

                        {bpView === "year" && (
                          <div className="grid grid-cols-4 gap-2">
                            {Array.from({ length: 12 }).map((_, i) => {
                              const yearStart = bpYear - 5;
                              const y = yearStart + i;
                              return (
                                <button
                                  key={y}
                                  type="button"
                                  onClick={() => handleSelectYear(y)}
                                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                                    bpYear === y ? "bg-green-600 text-white" : "text-gray-700"
                                  }`}
                                >
                                  {y}
                                </button>
                              );
                            })}
                            {/* quick controls to shift year range */}
                            <div className="col-span-4 flex justify-between mt-2">
                              <button
                                type="button"
                                onClick={() => setBpYear((y) => y - 12)}
                                className="px-3 py-1 rounded-md text-sm hover:bg-gray-100 flex items-center"
                              >
                                <HiChevronLeft className="w-9 h-9 text-green-600" />Range
                              </button>
                              <button
                                type="button"
                                onClick={() => setBpYear((y) => y + 12)}
                                className="px-3 py-1 rounded-md text-sm hover:bg-gray-100 flex items-center"
                              >
                                Range<HiChevronRight className="w-9 h-9 text-green-600" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Preview + controls */}
                    <div
                      className="
                      w-full lg:w-[50%] rounded-md p-4 flex flex-col flex-wrapx justify-between "
                    >
                      <div className="text-lg text-gray-800 mb-1 hidden lg:block">Please select your birthday</div>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-3 text-[#1a1a1a]">
                          <div className="flex flex-wrap items-baseline gap-3">
                            <div className="text-5xl lg:text-7xl font-bold ">
                              {bpSelected.getDate()}
                            </div>
                            <div className="text-4xl tracking-tight font-bold">
                              {bpSelected.toLocaleDateString(undefined, { weekday: "long" })}
                            </div>
                          </div>
                          
                          <div className="text-2xl ">
                            {monthNames[bpSelected.getMonth()]}, {bpSelected.getFullYear()}
                          </div>
                        </div>
                      </div>

                      {/* NEXT AND BACK BUTTON */}
                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex-1 rounded-lg bg-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-400 text-lg"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (bpSelected) {
                              setFormData((prev) => ({
                                ...prev,
                                tenant: { ...prev.tenant, date_of_birth: formatISO(bpSelected) },
                              }));
                              handleNext();
                            } else {
                              setErrors((prev) => ({
                                ...prev,
                                ["tenant.date_of_birth"]: "Please select your date of birth",
                              }));
                            }
                          }}
                          className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 text-lg"
                        >
                          Next
                        </button>
                      </div>

                      {errors["tenant.date_of_birth"] && (
                        <p className="mt-2 text-sm text-red-600">{errors["tenant.date_of_birth"]}</p>
                      )}
                    </div>
                  </div>
                  {/* BIRTHDAY PICKER - END */}
                </>
              )}

              {step === 6 && (
                <>
                  <label className="text-xs text-gray-600 flex justify-end"><span className="mr-auto text-sm">Bio</span>
                    <span>{formData.tenant.bio.length}/200</span>
                  </label>
                  <textarea
                    name="tenant.bio"
                    placeholder="I am Wailee, i own..."
                    maxLength={200}
                    value={formData.tenant.bio}
                    onChange={handleTenantBioChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  />
                  {errors["tenant.bio"] && (
                    <p className="text-sm text-red-600">{errors["tenant.bio"]}</p>
                  )}
                </>
              )}
            </>
          )}

          {/* ROLE-SPECIFIC FLOW: LANDLORD */}
          {formData.user_type === "landlord" && (
            <>
              {step === 4 && (
                <>
                  <input
                    type="tel"
                    name="landlord.phone_number"
                    placeholder="Phone Number *"
                    value={formData.landlord.phone_number}
                    onChange={handleLandlordPhoneChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                    inputMode="numeric"
                  />
                  {errors["landlord.phone_number"] && (
                    <p className="text-sm text-red-600">{errors["landlord.phone_number"]}</p>
                  )}
                </>
              )}

              {step === 5 && (
                <>
                  <label className="text-xs text-gray-600 flex justify-end">
                    <span>{formData.landlord.property_name.length}/50</span>
                  </label>
                  <input
                    type="text"
                    name="landlord.property_name"
                    placeholder="Property Name  *"
                    maxLength={50}
                    value={formData.landlord.property_name}
                    onChange={handlePropertyNameChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  />
                  {errors["landlord.property_name"] && (
                    <p className="text-sm text-red-600">{errors["landlord.property_name"]}</p>
                  )}

                  <input
                    type="number"
                    name="landlord.years_experience"
                    placeholder="Years of Experience *"
                    value={formData.landlord.years_experience}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  />
                  {errors["landlord.years_experience"] && (
                    <p className="text-sm text-red-600">{errors["landlord.years_experience"]}</p>
                  )}
                </>
              )}

              {step === 6 && (
                <>
                  <label className="block text-sm text-gray-600">Website </label>
                  <input
                    type="text"
                    name="landlord.website"
                    placeholder="https://holo.com"
                    value={formData.landlord.website}
                    onChange={handleWebsiteChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  />
                  {errors["landlord.website"] && (
                    <p className="text-sm text-red-600">{errors["landlord.website"]}</p>
                  )}

                  <label className="text-xs text-gray-600 flex justify-end">
                    <span className="mr-auto text-sm">Location</span>
                    <span>{formData.landlord.location.length}/50</span>
                  </label>
                  <input
                    type="text"
                    name="landlord.location"
                    placeholder="Abuja"
                    maxLength={50}
                    value={formData.landlord.location}
                    onChange={handleLocationChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  />
                  {errors["landlord.location"] && (
                    <p className="text-sm text-red-600">{errors["landlord.location"]}</p>
                  )}
                </>
              )}

              {step === 7 && (
                <>
                  <label className="text-xs text-gray-600 flex justify-end">
                    <span className="mr-auto text-sm">Bio</span>
                    <span>{formData.landlord.bio.length}/200</span>
                  </label>
                  <textarea
                    name="landlord.bio"
                    placeholder="I am Wailee, i own..."
                    maxLength={200}
                    value={formData.landlord.bio}
                    onChange={handleLandlordBioChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  />
                  {errors["landlord.bio"] && (
                    <p className="text-sm text-red-600">{errors["landlord.bio"]}</p>
                  )}
                </>
              )}
            </>
          )}

          {/* CONFIRMATION: tenant (step 7) or landlord (step 8) -> render when step === maxStep */}
          {step === maxStep && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Confirm Your Details
              </h2>
              <div className="rounded-lg border p-4 text-sm space-y-2">
                <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Role:</strong> {formData.user_type}</p>

                {formData.user_type === "tenant" && (
                  <>
                    <p><strong>Phone:</strong> {formData.phone_number}</p>
                    <p><strong>Date of Birth:</strong> {formData.tenant.date_of_birth}</p>
                    <p><strong>Bio:</strong> {formData.tenant.bio}</p>
                  </>
                )}

                {formData.user_type === "landlord" && (
                  <>
                    <p><strong>Phone:</strong> {formData.landlord.phone_number}</p>
                    <p><strong>Property Name:</strong> {formData.landlord.property_name}</p>
                    <p><strong>Years of Experience:</strong> {formData.landlord.years_experience}</p>
                    <p><strong>Website:</strong> {formData.landlord.website || "N/A"}</p>
                    <p><strong>Bio:</strong> {formData.landlord.bio}</p>
                    <p><strong>Location:</strong> {formData.landlord.location}</p>
                  </>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full bg-gray-300 px-6 py-2 font-semibold text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto flex items-center justify-center rounded-full bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
                >
                  {loading ? (
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Done"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Step navigation - hidden if in step 5 for tenant*/}
        
        <div
          className={`mt-6 flex justify-between ${formData.user_type === "tenant" && step === 5 ? "hidden" : ""}`}
        >
          {step > 1 && step < maxStep && (
            <button
              onClick={handleBack}
              className="rounded-full bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700"
            >
              Back
            </button>
          )}
          {step < maxStep && (
            <button
              onClick={handleNext}
              className="ml-auto rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white"
            >
              Next
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Register;
