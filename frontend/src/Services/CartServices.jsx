import axios from 'axios';

export const addToCart = async (userId, { productId, quantity = 1, size }) => {
  try {
    const response = await axios.post(`/api/carts/${userId}/items`, {
      productId,
      quantity,
      size,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
