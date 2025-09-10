import React from "react";

const LandlordRegister = ({
  step,
  formData,
  errors,
  handleChange,
  handleNext,
  handleBack,
  handleSubmit,
}) => {
  const landlord = formData.landlord;

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Landlord Info</h2>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={landlord.full_name}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-2"
          />
          {errors["landlord.full_name"] && (
            <p className="text-red-500">{errors["landlord.full_name"]}</p>
          )}
          <button type="button" onClick={handleNext} className="btn-primary">
            Next
          </button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Landlord Property Info</h2>
          <input
            type="text"
            name="property_name"
            placeholder="Property Name"
            value={landlord.property_name}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-2"
          />
          {errors["landlord.property_name"] && (
            <p className="text-red-500">{errors["landlord.property_name"]}</p>
          )}
          <div className="flex justify-between">
            <button type="button" onClick={handleBack} className="btn-secondary">
              Back
            </button>
            <button type="button" onClick={handleNext} className="btn-primary">
              Next
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Review Landlord Info</h2>
          <pre>{JSON.stringify(landlord, null, 2)}</pre>
          <button type="button" onClick={handleBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary">
            Submit
          </button>
        </div>
      )}
    </form>
  );
};

export default LandlordRegister;
