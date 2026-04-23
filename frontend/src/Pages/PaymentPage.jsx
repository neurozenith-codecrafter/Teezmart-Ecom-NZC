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
          }
        );
        setOrder(res.data.order);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load order.";
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
        {/* --- REFINED HEADER: Back Button beside Title --- */}
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
          <div className="w-8 h-1 bg-black mt-1 ml-9 rounded-full" />{" "}
          {/* Aligned bar with text */}
        </div>
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
    </div>
  );
};

export default PaymentPage;
