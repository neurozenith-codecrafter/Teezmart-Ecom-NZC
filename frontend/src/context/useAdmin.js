import { useContext } from "react";
import { AdminContext } from "./adminContext";

export const useAdmin = () => useContext(AdminContext);
