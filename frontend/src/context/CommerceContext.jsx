import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  addToCartAPI,
  getCartAPI,
  removeCartItemAPI,
  updateCartItemAPI,
} from "../Services/CartServices";
import {
  addWishlistItemAPI,
  getWishlistAPI,
  removeWishlistItemAPI,
} from "../Services/WishlistServices";
import { useAuth } from "../Hooks/useAuth";

export const CommerceContext = createContext(null);

const EMPTY_CART = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
  discount: 0,
  totalPrice: 0,
};

export const CommerceProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const wishlistSet = useMemo(
    () => new Set(wishlistItems.map((item) => String(item._id))),
    [wishlistItems],
  );

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(EMPTY_CART);
      return EMPTY_CART;
    }

    setIsCartLoading(true);
    try {
      const response = await getCartAPI({ token });
      const cartData = response?.data || EMPTY_CART;
      setCart({
        ...EMPTY_CART,
        ...cartData,
        items: cartData?.items || [],
      });
      return cartData;
    } finally {
      setIsCartLoading(false);
    }
  }, [token]);

  const refreshWishlist = useCallback(async () => {
    if (!token) {
      setWishlistItems([]);
      return [];
    }

    setIsWishlistLoading(true);
    try {
      const response = await getWishlistAPI({ token });
      const items = response?.data?.items || [];
      setWishlistItems(items);
      return items;
    } finally {
      setIsWishlistLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  const addToCart = useCallback(
    async ({ productId, quantity = 1, size }) => {
      const response = await addToCartAPI({ productId, quantity, size, token });
      setCart({ ...EMPTY_CART, ...(response?.data || EMPTY_CART) });
      return response;
    },
    [token],
  );

  const updateCartItem = useCallback(
    async ({ productId, quantity, size }) => {
      const response = await updateCartItemAPI({ productId, quantity, size, token });
      setCart({ ...EMPTY_CART, ...(response?.data || EMPTY_CART) });
      return response;
    },
    [token],
  );

  const removeCartItem = useCallback(
    async ({ productId, size }) => {
      const response = await removeCartItemAPI({ productId, size, token });
      setCart({ ...EMPTY_CART, ...(response?.data || EMPTY_CART) });
      return response;
    },
    [token],
  );

  const toggleWishlist = useCallback(
    async (product) => {
      const productId = String(product?._id || product?.productId || "");
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const isWishlisted = wishlistSet.has(productId);

      if (isWishlisted) {
        await removeWishlistItemAPI({ productId, token });
        setWishlistItems((prev) =>
          prev.filter((wishlistProduct) => String(wishlistProduct._id) !== productId),
        );
        return false;
      }

      await addWishlistItemAPI({ productId, token });
      setWishlistItems((prev) => {
        if (prev.some((wishlistProduct) => String(wishlistProduct._id) === productId)) {
          return prev;
        }
        return [product, ...prev];
      });
      return true;
    },
    [token, wishlistSet],
  );

  const value = useMemo(
    () => ({
      cart,
      cartItems: cart.items || [],
      cartCount: cart.totalQuantity || 0,
      isCartLoading,
      wishlistItems,
      wishlistIds: wishlistSet,
      wishlistCount: wishlistItems.length,
      isWishlistLoading,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateCartItem,
      removeCartItem,
      toggleWishlist,
    }),
    [
      cart,
      isCartLoading,
      wishlistItems,
      wishlistSet,
      isWishlistLoading,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateCartItem,
      removeCartItem,
      toggleWishlist,
    ],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
};
