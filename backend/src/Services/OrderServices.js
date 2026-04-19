const mongoose = require("mongoose");
const Order = require("../Models/OrderSchema");
const Product = require("../Models/ProductSchema");
const { ORDER_STATUSES } = require("../Constants/constant");
const {
  ensureValidObjectId,
  normalizeShippingAddress,
} = require("../Utils/validation");

const applySession = (query, session) => (session ? query.session(session) : query);

const normalizeSize = (size) => {
  if (size === undefined || size === null || size === "") {
    return undefined;
  }

  if (typeof size !== "string") {
    throw new Error("Selected size not available");
  }

  return size.trim();
};

const normalizeCheckoutItems = ({ items, buyNowItem }) => {
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasBuyNowItem =
    buyNowItem && typeof buyNowItem === "object" && !Array.isArray(buyNowItem);

  if (!hasItems && !hasBuyNowItem) {
    throw new Error("At least one item is required");
  }

  const rawItems = hasItems ? items : [buyNowItem];
  const normalizedItemsMap = new Map();

  rawItems.forEach((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`Each item must be an object. Invalid item at index ${index}`);
    }

    if (!item.productId) {
      throw new Error(`Invalid product ID at index ${index}`);
    }

    ensureValidObjectId(item.productId, `product ID at index ${index}`);

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Quantity must be greater than 0 for item at index ${index}`);
    }

    const normalizedSize = normalizeSize(item.size);
    const dedupeKey = `${item.productId}:${normalizedSize || ""}`;
    const existingItem = normalizedItemsMap.get(dedupeKey);

    if (existingItem) {
      existingItem.quantity += quantity;
      return;
    }

    normalizedItemsMap.set(dedupeKey, {
      productId: String(item.productId),
      quantity,
      size: normalizedSize
    });
  });

  const normalizedItems = Array.from(normalizedItemsMap.values());

  if (normalizedItems.length === 0) {
    throw new Error("At least one item is required");
  }

  return normalizedItems;
};

const fetchProductsByIds = async (productIds, session) => {
  const query = Product.find({
    _id: { $in: productIds }
  });

  const products = await applySession(query, session);

  return new Map(products.map((product) => [String(product._id), product]));
};

const validateStockAndBuildOrderItems = (normalizedItems, productMap) => {
  const requestedQuantityByProductId = new Map();

  for (const item of normalizedItems) {
    const currentQuantity = requestedQuantityByProductId.get(item.productId) || 0;
    requestedQuantityByProductId.set(item.productId, currentQuantity + item.quantity);
  }

  for (const [productId, requestedQuantity] of requestedQuantityByProductId.entries()) {
    const product = productMap.get(productId);

    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    if (!Number.isInteger(product.stock) || product.stock < requestedQuantity) {
      throw new Error(`Insufficient stock for product: ${product.title}`);
    }
  }

  const orderItems = normalizedItems.map((item) => {
    const product = productMap.get(item.productId);

    if (item.size && Array.isArray(product.sizes) && !product.sizes.includes(item.size)) {
      throw new Error(`Selected size not available for product: ${product.title}`);
    }

    return {
      product: product._id,
      name: product.title,
      image: product.images?.[0]?.url || "",
      price: product.price,
      size: item.size,
      quantity: item.quantity
    };
  });

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    orderItems,
    subtotal,
    requestedQuantityByProductId
  };
};

const reserveProductStock = async (requestedQuantityByProductId, session) => {
  const bulkOperations = Array.from(requestedQuantityByProductId.entries()).map(
    ([productId, quantity]) => ({
      updateOne: {
        filter: {
          _id: productId,
          stock: { $gte: quantity }
        },
        update: {
          $inc: {
            stock: -quantity,
            salesCount: quantity
          }
        }
      }
    })
  );

  if (bulkOperations.length === 0) {
    return;
  }

  const result = await Product.bulkWrite(bulkOperations, session ? { session } : {});

  if (result.modifiedCount !== bulkOperations.length) {
    throw new Error("Insufficient stock for one or more products");
  }
};

const populateOrderById = (orderId, session) => {
  const query = Order.findById(orderId).populate("items.product", "title price images stock");
  return applySession(query, session);
};

const persistOrder = async ({ userId, shippingAddress, normalizedItems, session }) => {
  const productIds = [...new Set(normalizedItems.map((item) => item.productId))];
  const productMap = await fetchProductsByIds(productIds, session);
  const { orderItems, subtotal, requestedQuantityByProductId } =
    validateStockAndBuildOrderItems(normalizedItems, productMap);
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const totalAmount = subtotal + shippingFee;

  await reserveProductStock(requestedQuantityByProductId, session);

  const [order] = await Order.create(
    [
      {
        user: userId,
        items: orderItems,
        shippingAddress,
        status: "order placed",
        totalAmount,
        pricing: {
          subtotal,
          shippingFee,
          total: totalAmount
        }
      }
    ],
    session ? { session } : {}
  );

  return populateOrderById(order._id, session);
};

const isTransactionUnsupportedError = (error) => {
  const message = error?.message || "";

  return (
    message.includes("Transaction numbers are only allowed on a replica set member") ||
    message.includes("Transaction numbers are only allowed on a mongos") ||
    message.includes("Standalone servers do not support transactions")
  );
};

exports.createOrder = async (
  userId,
  { shippingAddress, items = [], buyNowItem = null } = {}
) => {
  if (!userId) {
    throw new Error("User is required to place an order");
  }

  ensureValidObjectId(userId, "user ID");

  const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);
  const normalizedItems = normalizeCheckoutItems({ items, buyNowItem });
  const session = await mongoose.startSession();

  try {
    let order;

    try {
      await session.withTransaction(async () => {
        order = await persistOrder({
          userId,
          shippingAddress: normalizedShippingAddress,
          normalizedItems,
          session
        });
      });
    } catch (error) {
      if (!isTransactionUnsupportedError(error)) {
        throw error;
      }

      order = await persistOrder({
        userId,
        shippingAddress: normalizedShippingAddress,
        normalizedItems
      });
    }

    return order;
  } finally {
    await session.endSession();
  }
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

  // "cancelled" is a terminal side-exit — can be set from any non-delivered state
  if (status === "cancelled") {
    if (order.status === "delivered") {
      throw new Error("Order status cannot move backwards");
    }
  } else {
    // For forward progression: order placed → shipped → delivered
    const progressionStatuses = ["order placed", "shipped", "delivered"];
    const currentIndex = progressionStatuses.indexOf(order.status);
    const nextIndex = progressionStatuses.indexOf(status);

    if (currentIndex === -1 || nextIndex < currentIndex) {
      throw new Error("Order status cannot move backwards");
    }
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
