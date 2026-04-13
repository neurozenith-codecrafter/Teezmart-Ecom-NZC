import { useContext } from "react";
import { CommerceContext } from "../context/CommerceContext";

export const useCommerce = () => useContext(CommerceContext);
