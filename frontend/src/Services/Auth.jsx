import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../Hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, loading } = useAuth();
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // 🔥 Redirect if already logged in
  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, loading, navigate]);

  // 🔥 Handle Google login success
  const handleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setAuthLoading(true);

      if (!credentialResponse?.credential) {
        throw new Error("No credential received");
      }

      const response = await fetch(
        "/api/auth/google", // ✅ safer
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Authentication failed");
      }

      const data = await response.json();

      // ✅ Consistent backend contract
      login(data.data, data.token);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center items-center h-screen bg-[#F3F3F3] px-4 font-sans"
    >
      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[340px] flex flex-col items-center">
        <h1 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
          TeezMart
        </h1>

        <p className="text-zinc-400 text-[13px] font-light mb-10 text-center leading-tight px-2">
          This is where your perfect fit begins.
        </p>

        {/* 🔥 Google Login */}
        <div className="w-full flex justify-center mb-6">
          {authLoading ? (
            <p className="text-sm text-zinc-500">Signing you in...</p>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() =>
                setError("Google sign-in was cancelled or failed.")
              }
              useOneTap
              theme="outline"
              shape="pill"
              size="large"
              width="280"
            />
          )}
        </div>

        <p className="text-zinc-400 text-[11px] font-normal tracking-wide">
          Sign in to continue shopping
        </p>

        {error && (
          <p className="mt-4 text-[10px] text-rose-500 font-medium text-center uppercase tracking-wider">
            {error}
          </p>
        )}
      </div>
    </Motion.div>
  );
};

export default Auth;
