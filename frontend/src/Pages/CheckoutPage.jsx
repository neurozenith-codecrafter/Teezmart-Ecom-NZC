import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

// ─── Utility: split a full name into first + last ───────────────────────────
const splitName = (fullName = "") => {
  const parts = (fullName || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
};

// ─── Controlled SharpInput (same rendered structure / classNames as before) ──
const SharpInput = ({
  placeholder,
  fullWidth = false,
  className = "",
  id,
  value = "",
  onChange,
  error,
}) => (
  <div className={`${fullWidth ? "col-span-2" : "col-span-1"} ${className}`}>
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-4 text-[15px] text-gray-800 placeholder-gray-500 
                 border border-gray-400 bg-white rounded-none outline-none 
                 focus:border-black transition-colors"
    />
    {error && <p className="text-[11px] text-red-500 mt-1 ml-1">{error}</p>}
  </div>
);

// ─── Unchanged SVG icon ──────────────────────────────────────────────────────
const ChevronLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-7 h-7 text-gray-800"
  >
    <path
      d="M15 19L8 12L15 5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Checkout Page ────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // ── Form state (all fields in one object so nothing resets on step change) ──
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    house: "",
    street: "",
    landmark: "",
    pincode: "",
    cityState: "",
  });

  const [saveInfo, setSaveInfo] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // ── Auto-fill firstName / lastName from Google OAuth user on mount ──────────
  useEffect(() => {
    if (user?.name) {
      const { firstName, lastName } = splitName(user.name);
      setForm((prev) => ({
        ...prev,
        // Only pre-fill if the field is still empty (respects any user edits)
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
      }));
    }
  }, [user]);

  // ── Generic field updater — clears field error on change ───────────────────
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.mobile.trim()) e.mobile = "Required";
    if (!form.house.trim()) e.house = "Required";
    if (!form.street.trim()) e.street = "Required";
    if (!form.pincode.trim()) e.pincode = "Required";
    if (!form.cityState.trim()) e.cityState = "Required";
    return e;
  };

  // ── Backend save (only called when saveInfo is checked) ───────────────────
  const saveToBackend = async () => {
    if (!user?._id || !token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Derive city & state from the combined "City/State" input
    const [rawCity = "", rawState = ""] = form.cityState
      .split("/")
      .map((s) => s.trim());
    const city = rawCity || form.cityState.trim();
    const state = rawState || rawCity || form.cityState.trim();

    // Build the address payload expected by updateUserAddresses
    const addressPayload = [
      {
        street: [form.house.trim(), form.street.trim()]
          .filter(Boolean)
          .join(", "),
        city,
        state,
        pincode: form.pincode.trim(),
        country: "India",
        isDefault: true,
      },
    ];

    // Fire both requests concurrently; individual failures are logged but
    // don't block the user from proceeding to step 2.
    const results = await Promise.allSettled([
      // Save phone to user profile
      fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ phone: form.mobile.trim() }),
      }),
      // Save address
      fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${user._id}/address`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(addressPayload),
        },
      ),
    ]);

    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`Checkout save request ${i + 1} failed:`, result.reason);
      }
    });
  };

  // ── "Next" button handler ─────────────────────────────────────────────────
  const handleNext = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Block step transition until all required fields are filled
    }

    if (saveInfo) {
      try {
        setIsSaving(true);
        await saveToBackend();
      } catch (err) {
        console.error("Checkout save error:", err);
      } finally {
        setIsSaving(false);
      }
    }

    setStep(2);
  };

  // ── Back button — step 1 data is preserved because form state is component-
  //    level and does NOT reset on step change. ──────────────────────────────
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4 font-sans selection:bg-gray-200">
      <div className="w-full max-w-[500px] flex flex-col">
        {/* --- HEADER --- */}
        <div className="relative flex items-center justify-center mb-12 h-10">
          <button
            onClick={handleBack}
            className="absolute left-0 p-3 -ml-3 text-gray-800 hover:text-black hover:bg-gray-50 transition-all focus:outline-none active:scale-90"
            aria-label="Go back"
          >
            <ChevronLeftIcon />
          </button>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <span
                className={`ml-2 text-[11px] uppercase tracking-widest ${
                  step === 1
                    ? "font-bold text-gray-900"
                    : "font-medium text-gray-400"
                }`}
              >
                Checkout
              </span>
            </div>

            <div
              className={`w-8 h-px ${step === 2 ? "bg-black" : "bg-gray-300"}`}
            ></div>

            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  step === 2
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span
                className={`ml-2 text-[11px] uppercase tracking-widest ${
                  step === 2
                    ? "font-bold text-gray-900"
                    : "font-medium text-gray-400"
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* --- CONTENT AREA (FIXED) --- */}
        <div className="relative">
          {/* STEP 1 */}
          <div
            className={`transition-opacity duration-300 ${
              step === 1
                ? "opacity-100 relative"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-10">
                <h3 className="text-[15px] font-bold uppercase tracking-wider text-gray-900 mb-5">
                  Contact Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <SharpInput
                    id="firstName"
                    placeholder="First name*"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    error={errors.firstName}
                  />
                  <SharpInput
                    id="lastName"
                    placeholder="Last name*"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    error={errors.lastName}
                  />
                  <SharpInput
                    id="mobile"
                    placeholder="Mobile Number*"
                    fullWidth
                    value={form.mobile}
                    onChange={handleChange("mobile")}
                    error={errors.mobile}
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[15px] font-bold uppercase tracking-wider text-gray-900 mb-5">
                  Address
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <SharpInput
                    id="house"
                    placeholder="House/Flat No/Building/Apartment*"
                    fullWidth
                    value={form.house}
                    onChange={handleChange("house")}
                    error={errors.house}
                  />
                  <SharpInput
                    id="street"
                    placeholder="Street/Locality*"
                    fullWidth
                    value={form.street}
                    onChange={handleChange("street")}
                    error={errors.street}
                  />
                  <SharpInput
                    id="landmark"
                    placeholder="Landmark (optional)"
                    fullWidth
                    value={form.landmark}
                    onChange={handleChange("landmark")}
                  />
                  <SharpInput
                    id="pincode"
                    placeholder="Pincode*"
                    value={form.pincode}
                    onChange={handleChange("pincode")}
                    error={errors.pincode}
                  />
                  <SharpInput
                    id="cityState"
                    placeholder="City/State*"
                    value={form.cityState}
                    onChange={handleChange("cityState")}
                    error={errors.cityState}
                  />
                </div>
              </div>

              <div className="flex items-center mt-6">
                <input
                  id="save-info"
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="w-4 h-4 border-gray-400 rounded-none text-black focus:ring-0 cursor-pointer accent-black"
                />
                <label
                  htmlFor="save-info"
                  className="ml-3 text-sm text-gray-600 cursor-pointer select-none"
                >
                  Save this information for next time
                </label>
              </div>

              <div className="flex justify-end mt-12">
                <button
                  onClick={handleNext}
                  disabled={isSaving}
                  className="bg-black text-white px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95 rounded-none"
                >
                  {isSaving ? "Saving..." : "Next"}
                </button>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div
            className={`transition-opacity duration-300 ${
              step === 2
                ? "opacity-100 relative"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="py-24 border border-gray-100 text-center bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-[0.2em]">
                Payment Method
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                Secure gateway loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
