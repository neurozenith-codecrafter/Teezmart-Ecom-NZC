import React, { useState } from "react";

const SharpInput = ({ placeholder, fullWidth = false, className = "" }) => (
  <div className={`${fullWidth ? "col-span-2" : "col-span-1"} ${className}`}>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-4 text-[15px] text-gray-800 placeholder-gray-500 
                 border border-gray-400 bg-white rounded-none outline-none 
                 focus:border-black transition-colors"
    />
  </div>
);

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

const CheckoutPage = () => {
  const [step, setStep] = useState(1);

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      window.history.back();
    }
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
                  <SharpInput placeholder="First name*" />
                  <SharpInput placeholder="Last name*" />
                  <SharpInput placeholder="Mobile Number*" fullWidth />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[15px] font-bold uppercase tracking-wider text-gray-900 mb-5">
                  Address
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <SharpInput
                    placeholder="House/Flat No/Building/Apartment*"
                    fullWidth
                  />
                  <SharpInput placeholder="Street/Locality*" fullWidth />
                  <SharpInput placeholder="Landmark (optional)" fullWidth />
                  <SharpInput placeholder="Pincode*" />
                  <SharpInput placeholder="City/State*" />
                </div>
              </div>

              <div className="flex items-center mt-6">
                <input
                  id="save-info"
                  type="checkbox"
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
                  onClick={() => setStep(2)}
                  className="bg-black text-white px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95 rounded-none"
                >
                  Next
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
