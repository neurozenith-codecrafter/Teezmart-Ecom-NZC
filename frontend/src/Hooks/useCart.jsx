import { addToCartAPI } from "../Services/CartServices";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useCart = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async ({ productId, quantity = 1, size }) => {
    // 1. Auth check
    if (!token) {
      navigate("/login");
      return;
    }

    // 2. Size validation
    if (!size) {
      alert("Please select a size");
      return;
    }

    try {
      const data = await addToCartAPI({
        productId,
        quantity,
        size,
        token,
      });

      console.log("Cart updated:", data);

      // Optional UX
      alert("Added to cart");

    } catch (error) {
      console.error("Add to cart failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return { handleAddToCart };
};