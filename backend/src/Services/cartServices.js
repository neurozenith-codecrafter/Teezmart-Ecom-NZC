const Cart = require("../Models/CartSchema");
const Product = require("../Models/ProductSchema");

// Helper: recalculate cart totals
const recalculateCart = (cart) => {
  cart.totalQuantity = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  cart.subtotal = cart.items.reduce(
    (acc, item) => acc + item.totalItemPrice,
    0
  );

  cart.totalPrice = cart.subtotal; // extend later (discounts, tax)

  return cart;
};

exports.addToCart = async (userId, { productId, quantity = 1, size }) => {
  // 🔹 1. Validate input
  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  // 🔹 2. Get product
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // 🔹 (Optional but recommended)
  // if (product.stock < quantity) {
  //   throw new Error("Not enough stock");
  // }

  // 🔹 3. Get or create cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
  }

  // 🔹 4. Check if item already exists
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    // ✅ Update quantity
    existingItem.quantity += quantity;

    existingItem.totalItemPrice =
      existingItem.quantity * existingItem.price;
  } else {
    // ✅ Add new item (SNAPSHOT)
    cart.items.push({
      product: product._id,
      name: product.title,                // snapshot
      image: product.images?.[0]?.url,    // snapshot
      price: product.price,               // snapshot
      quantity,
      totalItemPrice: product.price * quantity,
    });
  }

  // 🔹 5. Update activity
  cart.lastActivityAt = new Date();

  // 🔹 6. Recalculate totals
  recalculateCart(cart);

  // 🔹 7. Save
  await cart.save();

  return cart;
};

// cart.service.js
exports.getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product", "title price images");

  if (!cart) {
    return {
      items: [],
      totalQuantity: 0,
      subtotal: 0,
      totalPrice: 0,
    };
  }

  return cart;
};

exports.updateCartItem = async (userId, { productId, quantity, size }) => {
  if (quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) throw new Error("Item not found in cart");

  if (quantity === 0) {
    // remove item
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );
  } else {
    item.quantity = quantity;
    item.totalItemPrice = item.price * quantity;
  }

  // 🔁 recalc
  recalculateCart(cart);

  await cart.save();
  return cart;
};

exports.removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  recalculateCart(cart);

  await cart.save();
  return cart;
};

exports.clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    // If no cart, create an empty one
    const newCart = new Cart({
      user: userId,
      items: [],
    });
    await newCart.save();
    return newCart;
  }

  cart.items = [];
  cart.totalQuantity = 0;
  cart.subtotal = 0;
  cart.totalPrice = 0;

  await cart.save();
  return cart;
};