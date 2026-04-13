import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { useCommerce } from "./useCommerce";

export const useWishlist = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { wishlistItems, wishlistIds, toggleWishlist, refreshWishlist } = useCommerce();

  const handleToggleWishlist = async (product) => {
    if (!token) {
      navigate("/login");
      return false;
    }

    try {
      return await toggleWishlist(product);
    } catch (error) {
      console.error("Wishlist update failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  return {
    wishlistItems,
    wishlistIds,
    refreshWishlist,
    handleToggleWishlist,
  };
};
