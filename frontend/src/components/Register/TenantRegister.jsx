import React from "react";

const TenantRegister = ({
  step,
  formData,
  errors,
  handleChange,
  handleNext,
  handleBack,
  handleSubmit,
}) => {
  const tenant = formData.tenant;

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Tenant Info</h2>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={tenant.full_name}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-2"
          />
          {errors["tenant.full_name"] && (
            <p className="text-red-500">{errors["tenant.full_name"]}</p>
          )}
          <button type="button" onClick={handleNext} className="btn-primary">
            Next
          </button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Tenant Date of Birth</h2>
          <input
            type="date"
            name="date_of_birth"
            value={tenant.date_of_birth}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-2"
          />
          {errors["tenant.date_of_birth"] && (
            <p className="text-red-500">{errors["tenant.date_of_birth"]}</p>
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
          <h2 className="text-xl font-bold mb-4">Review Tenant Info</h2>
          <pre>{JSON.stringify(tenant, null, 2)}</pre>
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

export default TenantRegister;
