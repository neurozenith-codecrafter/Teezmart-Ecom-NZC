import React, { useMemo } from "react";
import { AdminContext } from "./adminContext";
import { useAuth } from "../Hooks/useAuth";

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const admin = useMemo(
    () => ({
      name: user?.name || "",
      role: user?.role || "user",
      email: user?.email || "",
    }),
    [user],
  );

  return (
    <AdminContext.Provider value={{ admin }}>
      {children}
    </AdminContext.Provider>
  );
};
