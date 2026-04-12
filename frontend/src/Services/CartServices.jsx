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