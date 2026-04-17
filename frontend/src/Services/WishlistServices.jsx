import axios from "axios";

export const getWishlistAPI = async ({ token }) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addWishlistItemAPI = async ({ productId, token }) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/users/wishlist/${productId}`,
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
  const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/wishlist/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
