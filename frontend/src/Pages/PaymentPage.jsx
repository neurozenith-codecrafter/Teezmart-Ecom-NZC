import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { useAuth } from "../Hooks/useAuth";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    console.log("PaymentPage mounted with order ID:", id);

    if (!id) {
      setError("Invalid order. Please go back.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOrder(res.data.order);
        console.log("Order data fetched successfully:", res.data.order);
      } catch (err) {
        const message = err.response?.data?.message || "Failed to load order.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const handleBack = () => {
    navigate("/checkout");
  };

  if (!id) return <div>Invalid access</div>;
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white pb-16">
      <div className="max-w-[1000px] mx-auto px-6 pt-8">
        {/* --- HEADER --- */}
        <div className="mb-10">
          <div className="flex items-center space-x-1 -ml-2">
            <button
              onClick={handleBack}
              className="p-2 text-gray-800 hover:text-black transition-colors focus:outline-none"
              aria-label="Go back"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 19L8 12L15 5" />
              </svg>
            </button>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Payment
            </h1>
          </div>
          <div className="w-8 h-1 bg-black mt-1 ml-9 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* --- LEFT COLUMN: Payment Inputs --- */}
          <div className="lg:col-span-7">
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-[0.2em]">
              Payment Method
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">
              All transactions are secure and encrypted.
            </p>

            <div className="space-y-6">
              {/* Card Number */}
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors placeholder:text-gray-200 text-sm tracking-[0.1em]"
                />
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors placeholder:text-gray-200 text-sm tracking-[0.1em]"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400 group-focus-within:text-black transition-colors">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors placeholder:text-gray-200 text-sm tracking-[0.1em]"
                  />
                </div>
              </div>
            </div>

            {/* --- DESIGNED CONFIRM BUTTON (Moved below inputs) --- */}
            <div className="mt-12">
              <button
                className="w-full bg-black text-white py-5 px-8 
                     text-xs font-bold uppercase tracking-[0.2em] 
                     hover:bg-gray-800 transition-all active:scale-[0.98] 
                     rounded-none focus:outline-none"
              >
                Confirm Order
              </button>
              <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-tight">
                By clicking confirm, you agree to our{" "}
                <span className="underline cursor-pointer">
                  terms of service
                </span>
                .
              </p>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Order Summary --- */}
          <div className="lg:col-span-5 bg-gray-50/50 p-8 self-start">
            <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-[0.2em]">
              Order Summary
            </h3>

            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">${order.pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold">$50.00</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-gray-500">Tax</span>
                <span className="font-bold">--</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Total
              </span>
              <span className="text-2xl font-black italic">${order.pricing.total.toFixed(2)}</span>
            </div>

            {/* Safe Badge */}
            <div className="mt-8 flex items-center space-x-2 text-[10px] text-gray-400 uppercase tracking-widest">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.908-3.367 9.132-8 10.125-4.633-.993-8-5.217-8-10.125 0-.681.057-1.35.166-2.001zm9.87 3.826a1 1 0 111.414 1.415l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L8 10.086l3.293-3.26z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Level 1 PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
