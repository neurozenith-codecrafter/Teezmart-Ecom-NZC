import React, { useState } from "react";
import { AdminContext } from "./adminContext";

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState({
    name: "Arjun Sharma",
    role: "DEV_ADMIN",
    email: "admin@teezmart.com",
  });

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
