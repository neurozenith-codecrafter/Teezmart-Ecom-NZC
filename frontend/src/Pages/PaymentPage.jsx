import React from "react";

const PaymentPage = () => {
  return (
    <div className="py-20 px-6 border border-gray-100 text-center bg-gray-50/50 flex flex-col items-center">
      <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-[0.2em]">
        Payment Method
      </h3>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-10">
        All transactions are secure and encrypted.
      </p>

      {/* --- DESIGNED CONFIRM BUTTON --- */}
      <button
        className="w-full max-w-[300px] bg-black text-white py-4 px-8 
                   text-xs font-bold uppercase tracking-[0.2em] 
                   hover:bg-gray-800 transition-all active:scale-95 
                   rounded-none focus:outline-none"
      >
        Confirm Order
      </button>

      <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-tight">
        By clicking confirm, you agree to our terms of service.
      </p>
    </div>
  );
};

export default PaymentPage;
