import { useContext } from "react";
import { AuthContext } from "../context/authContextInstance";

export const useAuth = () => useContext(AuthContext);