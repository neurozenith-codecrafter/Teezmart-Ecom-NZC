import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { useCommerce } from "./useCommerce";

export const useCart = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { addToCart, updateCartItem, removeCartItem, refreshCart, cart, cartItems, isCartLoading } =
    useCommerce();

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
      await addToCart({ productId, quantity, size });
    } catch (error) {
      console.error("Add to cart failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return {
    handleAddToCart,
    updateCartItem,
    removeCartItem,
    refreshCart,
    cart,
    cartItems,
    isCartLoading,
  };
};