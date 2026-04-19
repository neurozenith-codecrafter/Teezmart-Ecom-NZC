import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import PaymentPage from "./PaymentPage";

// ─── Utility ──────────────────────────────────────
const splitName = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
};

// ─── SharpInput (UNCHANGED UI) ────────────────────
const SharpInput = ({
  placeholder,
  type = "text",
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
      type={type}
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

// ─── Icon ─────────────────────────────────────────
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-gray-800">
    <path
      d="M15 19L8 12L15 5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Main ─────────────────────────────────────────
const CheckoutPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [hasSavedOnce, setHasSavedOnce] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    house: "",
    street: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [saveInfo, setSaveInfo] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // ── Autofill ────────────────────────────────────
  useEffect(() => {
    if (!user?.name) return;

    const { firstName, lastName } = splitName(user.name);

    setForm((prev) => ({
      ...prev,
      firstName: prev.firstName || firstName,
      lastName: prev.lastName || lastName,
    }));
  }, [user]);

  // ── Change handler ──────────────────────────────
  const handleChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;

      setForm((prev) => ({ ...prev, [field]: value }));

      setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
    },
    [],
  );

  // ── Validation ──────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";

    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Invalid mobile number";

    if (!form.house.trim()) e.house = "Required";
    if (!form.street.trim()) e.street = "Required";

    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Invalid pincode";

    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";

    return e;
  };

  // ── Backend Save ────────────────────────────────
  const saveToBackend = async () => {
    if (!user?._id || !token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const addressPayload = [
      {
        street: [form.house, form.street].filter(Boolean).join(", "),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: "India",
        isDefault: true,
      },
    ];

    const requests = [
      form.mobile.trim()
        ? fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ phone: form.mobile.trim() }),
          })
        : null,

      fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${user._id}/address`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(addressPayload),
        },
      ),
    ].filter(Boolean);

    const results = await Promise.allSettled(requests);

    results.forEach((res) => {
      if (res.status === "fulfilled" && !res.value.ok) {
        console.error("API error");
      }
      if (res.status === "rejected") {
        console.error("Network error:", res.reason);
      }
    });
  };

  // ── Update Address ──────────────────────────────
  const updateAddress = async () => {
    if (!user?._id || !token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/profile/${user._id}/address`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          street: `${form.house}, ${form.street}`,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        }),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to update address");
    }
  };

  // ── Next Handler ────────────────────────────────
  const handleNext = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (saveInfo) {
        setIsSaving(true);

        if (!hasSavedOnce) {
          await saveToBackend();
          setHasSavedOnce(true);
        } else {
          await updateAddress();
        }
      }

      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Back ────────────────────────────────────────
  const handleBack = () => {
    if (step === 2) return setStep(1);
    navigate(-1);
  };

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
                className={`ml-2 text-[11px] uppercase tracking-widest ${step === 1 ? "font-bold text-gray-900" : "font-medium text-gray-400"}`}
              >
                Checkout
              </span>
            </div>
            <div
              className={`w-8 h-px ${step === 2 ? "bg-black" : "bg-gray-300"}`}
            ></div>
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step === 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <span
                className={`ml-2 text-[11px] uppercase tracking-widest ${step === 2 ? "font-bold text-gray-900" : "font-medium text-gray-400"}`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="relative">
          {/* STEP 1 */}
          <div
            className={`transition-opacity duration-300 ${step === 1 ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"}`}
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

                  {/* --- Separate Pincode, City, and State --- */}
                  <SharpInput
                    id="pincode"
                    placeholder="Pincode*"
                    value={form.pincode}
                    onChange={handleChange("pincode")}
                    error={errors.pincode}
                  />
                  <SharpInput
                    id="city"
                    placeholder="City*"
                    value={form.city}
                    onChange={handleChange("city")}
                    error={errors.city}
                  />
                  <SharpInput
                    id="state"
                    placeholder="State*"
                    fullWidth
                    value={form.state}
                    onChange={handleChange("state")}
                    error={errors.state}
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
            className={`transition-opacity duration-300 ${step === 2 ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"}`}
          >
            <PaymentPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
