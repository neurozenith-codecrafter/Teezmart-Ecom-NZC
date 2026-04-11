import React from 'react'
import { addToCart } from '../Services/CartServices';

export const useCart = () => {

  const handleAddToCart = async (userId, product, size) => {
      // Implement the logic to add the product to the cart
      await addToCart(userId, { productId: product._id, quantity: 1, size });
  } 

  return {
    handleAddToCart,
  }
}
