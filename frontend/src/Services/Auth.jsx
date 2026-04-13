import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, loading } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, loading, navigate]);

  const handleSuccess = async (credentialResponse) => {
    try {
      setError("");

      if (!credentialResponse?.credential) {
        throw new Error("No credential received");
      }

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Authentication failed");
      }

      const data = await response.json();

      login(data.user || data.data, data.token);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Unable to sign in. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 px-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          setError("Google sign-in was cancelled or failed.");
        }}
      />
      {error ? (
        <p className="text-sm text-rose-500 font-medium text-center">{error}</p>
      ) : null}
    </div>
  );
};

export default Auth;
