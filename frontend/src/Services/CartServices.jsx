import axios from "axios";

export const addToCartAPI = async ({ productId, quantity, size, token }) => {
  const response = await axios.post(
    "/api/cart",
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

  console.log("Post api sent -> ", response.data);

  return response.data;
};

export const getCartAPI = async ({ token }) => {
  const response = await axios.get("/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCartItemAPI = async ({ productId, quantity, size, token }) => {
  const response = await axios.put(
    "/api/cart",
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
  const response = await axios.delete(`/api/cart/${productId}`, {
    params: { size },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};