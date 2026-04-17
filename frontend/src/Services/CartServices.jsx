import axios from "axios";
import { buildApiUrl } from "../constants/api";

export const addToCartAPI = async ({ productId, quantity, size, token }) => {
  const response = await axios.post(
    buildApiUrl("/api/cart"),
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
  const response = await axios.get(buildApiUrl("/api/cart"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCartItemAPI = async ({ productId, quantity, size, token }) => {
  const response = await axios.put(
    buildApiUrl("/api/cart"),
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
  const response = await axios.delete(buildApiUrl(`/api/cart/${productId}`), {
    params: { size },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
