import axios from "axios";

export const addToCartAPI = async ({ productId, quantity, size, token }) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/cart`,
    {
      productId,
      quantity,
      size,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCartAPI = async ({ token }) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCartItemAPI = async ({ productId, quantity, size, token }) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/cart`,
    { productId, quantity, size },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const removeCartItemAPI = async ({ productId, size, token }) => {
  const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, {
    params: { size },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
