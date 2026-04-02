import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
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
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save user (IMPORTANT for UI)
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("Login failed");
        }}
      />
    </div>
  );
};

export default Auth;
