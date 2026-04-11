const mongoose = require("mongoose");
const Order = require("../Models/OrderSchema");
const Cart = require("../Models/CartSchema");
const Product = require("../Models/ProductSchema");

const ORDER_STATUSES = ["order placed", "shipped", "delivered"];

const requiredAddressFields = [
  "fullName",
  "phone",
  "addressLine",
  "city",
  "state",
  "pincode",
  "country"
];

const normalizeShippingAddress = (shippingAddress) => {
  if (!shippingAddress || typeof shippingAddress !== "object") {
    throw new Error("Shipping address is required");
  }

  for (const field of requiredAddressFields) {
    if (
      typeof shippingAddress[field] !== "string" ||
      shippingAddress[field].trim() === ""
    ) {
      throw new Error(`Missing field: ${field}`);
    }
  }

  return Object.fromEntries(
    requiredAddressFields.map((field) => [field, shippingAddress[field].trim()])
  );
};

const ensureValidObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const buildBuyNowItems = async (buyNowItem) => {
  if (!buyNowItem.productId) {
    throw new Error("Product ID is required for buy now");
  }

  ensureValidObjectId(buyNowItem.productId, "product ID");

  const product = await Product.findById(buyNowItem.productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const quantity = Number(buyNowItem.quantity) || 1;

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  return {
    orderItems: [
      {
        product: product._id,
        name: product.title,
        image: product.images?.[0]?.url || "",
        price: product.price,
        size: buyNowItem.size,
        quantity
      }
    ],
    subtotal: product.price * quantity
  };
};

const buildCartItems = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (!cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`Product unavailable: ${item.product}`);
    }

    orderItems.push({
      product: product._id,
      name: product.title,
      image: product.images?.[0]?.url || "",
      price: product.price,
      size: item.size,
      quantity: item.quantity
    });

    subtotal += product.price * item.quantity;
  }

  cart.items = [];
  cart.totalPrice = 0;
  cart.subtotal = 0;
  cart.totalQuantity = 0;
  await cart.save();

  return { orderItems, subtotal };
};

exports.createOrder = async (userId, shippingAddress, buyNowItem = null) => {
  if (!userId) {
    throw new Error("User is required to place an order");
  }

  ensureValidObjectId(userId, "user ID");

  const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);
  const { orderItems, subtotal } = buyNowItem
    ? await buildBuyNowItems(buyNowItem)
    : await buildCartItems(userId);

  if (orderItems.length === 0) {
    throw new Error("No valid items to place order");
  }

  const shippingFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shippingFee;

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress: normalizedShippingAddress,
    status: "order placed",
    pricing: {
      subtotal,
      shippingFee,
      total
    }
  });

  return Order.findById(order._id).populate("items.product", "title price images");
};

exports.getMyOrders = async (userId) => {
  if (!userId) {
    throw new Error("User is required");
  }

  return Order.find({ user: userId })
    .populate("items.product", "title price images")
    .sort({ createdAt: -1 });
};

exports.getOrderById = async (orderId) => {
  ensureValidObjectId(orderId, "order ID");

  const order = await Order.findById(orderId)
    .populate("user", "name email role")
    .populate("items.product", "title price images");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

exports.updateOrderStatus = async (orderId, status) => {
  ensureValidObjectId(orderId, "order ID");

  if (!ORDER_STATUSES.includes(status)) {
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const currentIndex = ORDER_STATUSES.indexOf(order.status);
  const nextIndex = ORDER_STATUSES.indexOf(status);

  if (nextIndex < currentIndex) {
    throw new Error("Order status cannot move backwards");
  }

  order.status = status;

  if (status === "shipped" && !order.shippedAt) {
    order.shippedAt = new Date();
  }

  if (status === "delivered") {
    if (!order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (!order.deliveredAt) {
      order.deliveredAt = new Date();
    }
  }

  await order.save();

  return Order.findById(order._id)
    .populate("user", "name email role")
    .populate("items.product", "title price images");
};
