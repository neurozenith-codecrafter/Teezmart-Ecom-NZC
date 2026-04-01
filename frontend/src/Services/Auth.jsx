import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          console.log(jwtDecode(credentialResponse.credential));
          navigate("/");
        }}
        onError={() => {
          console.log("Login failed");
        }}
      />
    </div>
  );
};

export default Auth;
