import axios from "axios";
import { buildApiUrl } from "../constants/api";

export const getWishlistAPI = async ({ token }) => {
  const response = await axios.get(buildApiUrl("/api/users/wishlist"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addWishlistItemAPI = async ({ productId, token }) => {
  const response = await axios.post(
    buildApiUrl(`/api/users/wishlist/${productId}`),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const removeWishlistItemAPI = async ({ productId, token }) => {
  const response = await axios.delete(buildApiUrl(`/api/users/wishlist/${productId}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
