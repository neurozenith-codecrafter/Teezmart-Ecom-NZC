const Cart = require("../Models/CartSchema");
const Product = require("../Models/ProductSchema");
const { ensureValidObjectId } = require("../Utils/validation");

const populateCartProducts = (query) =>
  query.populate("items.product", "title price images slug sizes category");

// Ensure snapshot fields reflect the latest Product data.
// This keeps cart UI consistent after admin edits.
const syncSnapshotsFromProducts = (cart) => {
  if (!cart || !Array.isArray(cart.items)) return cart;

  for (const item of cart.items) {
    const productDoc = item?.product;
    if (!productDoc || typeof productDoc !== "object") continue;

    const latestTitle = productDoc.title;
    const latestPrice = productDoc.price;
    const latestImage = productDoc.images?.[0]?.url || "";

    if (typeof latestTitle === "string" && latestTitle.trim()) {
      item.name = latestTitle;
    }

    if (typeof latestPrice === "number" && Number.isFinite(latestPrice)) {
      item.price = latestPrice;
    }

    item.image = latestImage;
    item.totalItemPrice = item.quantity * item.price;
  }

  return cart;
};

const getHydratedCartByUserId = async (userId) => {
  const cart = await populateCartProducts(Cart.findOne({ user: userId }));
  if (!cart) return null;

  syncSnapshotsFromProducts(cart);
  recalculateCart(cart);

  // Persist the synced snapshots so subsequent responses are consistent
  // even if other handlers don't populate.
  await cart.save();
  return cart;
};

// Helper: recalculate cart totals
const recalculateCart = (cart) => {
  cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  cart.subtotal = cart.items.reduce(
    (acc, item) => acc + item.totalItemPrice,
    0,
  );

  cart.totalPrice = cart.subtotal; // extend later (discounts, tax)

  return cart;
};

exports.addToCart = async (userId, { productId, quantity = 1, size }) => {
  // 🔹 1. Validate input
  if (!productId) {
    throw new Error("Product ID is required");
  }

  ensureValidObjectId(userId, "user ID");
  ensureValidObjectId(productId, "product ID");

  const normalizedQuantity = Number(quantity);

  if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 1) {
    throw new Error("Quantity must be at least 1");
  }
  
  // 🔹 2. Get product
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (!size || !product.sizes.includes(size)) {
    throw new Error("Selected size not available");
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
    (item) => item.product.toString() === productId && item.size === size,
  );

  if (existingItem) {
    // ✅ Update quantity
    existingItem.quantity += normalizedQuantity;
    // Always use latest price/title/image when product was edited
    existingItem.name = product.title;
    existingItem.price = product.price;
    existingItem.image = product.images?.[0]?.url || "";
    existingItem.totalItemPrice = existingItem.quantity * existingItem.price;
  } else {
    // ✅ Add new item (SNAPSHOT)
    cart.items.push({
      product: product._id,
      name: product.title, // snapshot
      image: product.images?.[0]?.url, // snapshot
      price: product.price, // snapshot
      size,
      quantity: normalizedQuantity,
      totalItemPrice: product.price * normalizedQuantity,
    });
  }

  // 🔹 5. Update activity
  cart.lastActivityAt = new Date();

  // 🔹 6. Recalculate totals
  recalculateCart(cart);

  // 🔹 7. Save
  await cart.save();

  // Return hydrated cart so frontend always receives latest product details
  return getHydratedCartByUserId(userId);
};

// cart.service.js
exports.getCart = async (userId) => {
  ensureValidObjectId(userId, "user ID");

  const cart = await populateCartProducts(Cart.findOne({ user: userId }));

  if (!cart) {
    return {
      items: [],
      totalQuantity: 0,
      subtotal: 0,
      totalPrice: 0,
    };
  }

  syncSnapshotsFromProducts(cart);
  recalculateCart(cart);
  await cart.save();
  return cart;
};

exports.updateCartItem = async (userId, { productId, quantity, size }) => {
  ensureValidObjectId(userId, "user ID");
  ensureValidObjectId(productId, "product ID");

  const normalizedQuantity = Number(quantity);

  if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (i) => i.product.toString() === productId && i.size === size,
  );

  if (!item) throw new Error("Item not found in cart");

  if (normalizedQuantity === 0) {
    // remove item
    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === productId && i.size === size),
    );
  } else {
    // Sync item pricing/name/image with latest product
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    item.name = product.title;
    item.price = product.price;
    item.image = product.images?.[0]?.url || "";
    item.quantity = normalizedQuantity;
    item.totalItemPrice = item.price * normalizedQuantity;
  }

  // 🔁 recalc
  recalculateCart(cart);

  await cart.save();
  return getHydratedCartByUserId(userId);
};

exports.removeItem = async (userId, productId, size) => {
  ensureValidObjectId(userId, "user ID");
  ensureValidObjectId(productId, "product ID");

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (item) => !(item.product.toString() === productId && item.size === size),
  );

  recalculateCart(cart);

  await cart.save();
  return getHydratedCartByUserId(userId);
};

exports.clearCart = async (userId) => {
  ensureValidObjectId(userId, "user ID");

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    // If no cart, create an empty one
    const newCart = new Cart({
      user: userId,
      items: [],
    });
    await newCart.save();
    return getHydratedCartByUserId(userId);
  }

  cart.items = [];
  cart.totalQuantity = 0;
  cart.subtotal = 0;
  cart.totalPrice = 0;

  await cart.save();
  return getHydratedCartByUserId(userId);
};
