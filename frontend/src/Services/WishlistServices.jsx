import axios from "axios";

export const getWishlistAPI = async ({ token }) => {
  const response = await axios.get("/api/users/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addWishlistItemAPI = async ({ productId, token }) => {
  const response = await axios.post(
    `/api/users/wishlist/${productId}`,
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
  const response = await axios.delete(`/api/users/wishlist/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
