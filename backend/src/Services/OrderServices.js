const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.createOrder = async (userId, shippingAddress) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error("Cart not found");
  if (!cart.items || cart.items.length === 0)
    throw new Error("Cart is empty");

  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) continue;
    if (item.quantity <= 0) continue;

    const price = product.price;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price,
      quantity: item.quantity
    });

    subtotal += price * item.quantity;
  }

  if (orderItems.length === 0)
    throw new Error("No valid items to place order");

  const shippingFee = subtotal > 1000 ? 0 : 50;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shippingFee + tax;

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,

    payment: {
      method: "COD",
      status: "pending"
    },

    delivery: {
      type: "standard",
      status: "processing"
    },

    pricing: {
      subtotal,
      shippingFee,
      tax,
      total
    }
  });

  // Clear cart
  cart.items = [];
  cart.totalPrice = 0;
  cart.totalQuantity = 0;
  await cart.save();

  return order;
};