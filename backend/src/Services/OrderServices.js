const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../Models/OrderSchema");
const Product = require("../Models/ProductSchema");
const { ORDER_STATUSES } = require("../Constants/constant");
const {
  ensureValidObjectId,
  normalizeShippingAddress,
} = require("../Utils/validation");

const PENDING_ORDER_STATUS = "pending";
const PLACED_ORDER_STATUS = "order placed";
const FAILED_ORDER_STATUS = "failed";
const PENDING_PAYMENT_STATUS = "pending";
const PAID_PAYMENT_STATUS = "paid";
const FAILED_PAYMENT_STATUS = "failed";

const applySession = (query, session) => (session ? query.session(session) : query);

const stableSortObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(stableSortObject);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = stableSortObject(value[key]);
      return acc;
    }, {});
};

const buildCheckoutFingerprint = ({ userId, shippingAddress, items }) => {
  const normalizedAddress = {
    firstName: shippingAddress.firstName?.trim().toLowerCase(),
    lastName: shippingAddress.lastName?.trim().toLowerCase(),
    phone: shippingAddress.phone,
    addressLine1: shippingAddress.addressLine1?.trim().toLowerCase(),
    addressLine2: shippingAddress.addressLine2?.trim().toLowerCase() || null,
    city: shippingAddress.city?.trim().toLowerCase(),
    state: shippingAddress.state?.trim().toLowerCase(),
    pincode: shippingAddress.pincode,
    country: (shippingAddress.country || "india").toLowerCase(),
  };

  const normalizedItems = items
    .map((item) => ({
      productId: String(item.productId),
      quantity: item.quantity,
      size: item.size || null,
    }))
    .sort((a, b) => a.productId.localeCompare(b.productId));

  const payload = {
    userId: String(userId),
    shippingAddress: normalizedAddress,
    items: normalizedItems,
  };

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
};

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
      size: normalizedSize,
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
    _id: { $in: productIds },
  });

  const products = await applySession(query, session);

  return new Map(products.map((product) => [String(product._id), product]));
};

const buildOrderItemsFromProducts = (normalizedItems, productMap, { enforceStock }) => {
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

    if (enforceStock && (!Number.isInteger(product.stock) || product.stock < requestedQuantity)) {
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
      quantity: item.quantity,
    };
  });

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const totalAmount = subtotal + shippingFee;

  return {
    orderItems,
    subtotal,
    shippingFee,
    totalAmount,
    requestedQuantityByProductId,
  };
};

const buildOrderDraft = async (normalizedItems, session, { enforceStock = true } = {}) => {
  const productIds = [...new Set(normalizedItems.map((item) => item.productId))];
  const productMap = await fetchProductsByIds(productIds, session);

  return buildOrderItemsFromProducts(normalizedItems, productMap, {
    enforceStock,
  });
};

const reserveProductStock = async (requestedQuantityByProductId, session) => {
  const bulkOperations = Array.from(requestedQuantityByProductId.entries()).map(
    ([productId, quantity]) => ({
      updateOne: {
        filter: {
          _id: productId,
          stock: { $gte: quantity },
        },
        update: {
          $inc: {
            stock: -quantity,
            salesCount: quantity,
          },
        },
      },
    }),
  );

  if (bulkOperations.length === 0) {
    return;
  }

  const result = await Product.bulkWrite(bulkOperations, session ? { session } : {});

  if (result.modifiedCount !== bulkOperations.length) {
    throw new Error("Insufficient stock for one or more products");
  }
};

const populateOrderDocument = (orderId, session) => {
  const query = Order.findById(orderId)
    .populate("items.product", "title price images stock")
    .populate("user", "name email role");

  return applySession(query, session);
};

const findExistingPendingOrder = ({ userId, checkoutFingerprint, session }) => {
  const query = Order.findOne({
    user: userId,
    checkoutFingerprint,
    status: PENDING_ORDER_STATUS,
    "payment.status": PENDING_PAYMENT_STATUS,
  }).sort({ createdAt: -1 });

  return applySession(query, session);
};

const findOrderByPaymentId = (razorpayPaymentId, session) => {
  if (!razorpayPaymentId) {
    return null;
  }

  const query = Order.findOne({
    "payment.razorpayPaymentId": razorpayPaymentId,
  });

  return applySession(query, session);
};

const isTransactionUnsupportedError = (error) => {
  const message = error?.message || "";

  return (
    message.includes("Transaction numbers are only allowed on a replica set member") ||
    message.includes("Transaction numbers are only allowed on a mongos") ||
    message.includes("Standalone servers do not support transactions")
  );
};

const createPendingOrderRecord = async ({
  userId,
  normalizedShippingAddress,
  normalizedItems,
  checkoutFingerprint,
  session,
}) => {
  const draft = await buildOrderDraft(normalizedItems, session, { enforceStock: true });

  const [order] = await Order.create(
    [
      {
        user: userId,
        items: draft.orderItems,
        shippingAddress: normalizedShippingAddress,
        checkoutFingerprint,
        status: PENDING_ORDER_STATUS,
        payment: {
          method: "razorpay",
          status: PENDING_PAYMENT_STATUS,
          lastAttemptAt: new Date(),
        },
        totalAmount: draft.totalAmount,
        pricing: {
          subtotal: draft.subtotal,
          shippingFee: draft.shippingFee,
          total: draft.totalAmount,
        },
      },
    ],
    session ? { session } : {},
  );

  return populateOrderDocument(order._id, session);
};

const createPendingOrder = async (userId, { shippingAddress, items = [], buyNowItem = null } = {}) => {
  if (!userId) {
    throw new Error("User is required to place an order");
  }

  ensureValidObjectId(userId, "user ID");

  const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);
  const normalizedItems = normalizeCheckoutItems({ items, buyNowItem });
  const checkoutFingerprint = buildCheckoutFingerprint({
    userId,
    shippingAddress: normalizedShippingAddress,
    items: normalizedItems,
  });
  const session = await mongoose.startSession();

  try {
    let order;

    try {
      await session.withTransaction(async () => {
        const existingOrder = await findExistingPendingOrder({
          userId,
          checkoutFingerprint,
          session,
        });

        if (existingOrder) {
          order = await populateOrderDocument(existingOrder._id, session);
          return;
        }

        order = await createPendingOrderRecord({
          userId,
          normalizedShippingAddress,
          normalizedItems,
          checkoutFingerprint,
          session,
        });
      });
    } catch (error) {
      if (error?.code === 11000) {
        const existingOrder = await findExistingPendingOrder({
          userId,
          checkoutFingerprint,
        });

        if (existingOrder) {
          return populateOrderDocument(existingOrder._id);
        }
      }

      if (!isTransactionUnsupportedError(error)) {
        throw error;
      }

      const existingOrder = await findExistingPendingOrder({
        userId,
        checkoutFingerprint,
      });

      if (existingOrder) {
        return populateOrderDocument(existingOrder._id);
      }

      order = await createPendingOrderRecord({
        userId,
        normalizedShippingAddress,
        normalizedItems,
        checkoutFingerprint,
      });
    }

    return order;
  } finally {
    await session.endSession();
  }
};

const finalizePaidOrderRecord = async ({ orderId, payment = {}, session }) => {
  const order = await populateOrderDocument(orderId, session);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.payment?.status === PAID_PAYMENT_STATUS) {
    return order;
  }

  if (order.payment?.status === FAILED_PAYMENT_STATUS || order.status === FAILED_ORDER_STATUS) {
    throw new Error("Cannot confirm payment for a failed order");
  }

  if (order.status !== PENDING_ORDER_STATUS || order.payment?.status !== PENDING_PAYMENT_STATUS) {
    throw new Error("Order is not awaiting payment");
  }

  const normalizedItems = order.items.map((item) => ({
    productId: String(item.product?._id || item.product),
    quantity: item.quantity,
    size: item.size,
  }));

  const draft = await buildOrderDraft(normalizedItems, session, { enforceStock: true });

  await reserveProductStock(draft.requestedQuantityByProductId, session);

  const now = new Date();
  const updateResult = await Order.updateOne(
    {
      _id: order._id,
      status: PENDING_ORDER_STATUS,
      "payment.status": PENDING_PAYMENT_STATUS,
    },
    {
      $set: {
        status: PLACED_ORDER_STATUS,
        totalAmount: draft.totalAmount,
        pricing: {
          subtotal: draft.subtotal,
          shippingFee: draft.shippingFee,
          total: draft.totalAmount,
        },
        items: draft.orderItems,
        stockReservedAt: now,
        paidAt: now,
        failedAt: null,
        "payment.status": PAID_PAYMENT_STATUS,
        "payment.razorpayOrderId": payment.razorpayOrderId || order.payment?.razorpayOrderId,
        "payment.razorpayPaymentId": payment.razorpayPaymentId || order.payment?.razorpayPaymentId,
        "payment.razorpaySignature": payment.razorpaySignature || order.payment?.razorpaySignature,
        "payment.failureReason": null,
        "payment.lastAttemptAt": now,
      },
    },
    session ? { session } : {},
  );

  if (updateResult.modifiedCount !== 1) {
    const refreshedOrder = await populateOrderDocument(order._id, session);

    if (refreshedOrder?.payment?.status === PAID_PAYMENT_STATUS) {
      return refreshedOrder;
    }

    throw new Error("Failed to confirm payment");
  }

  return populateOrderDocument(order._id, session);
};

const markOrderPaymentSucceeded = async (userId, orderId, payment = {}) => {
  if (!userId) {
    throw new Error("User is required");
  }

  ensureValidObjectId(userId, "user ID");
  ensureValidObjectId(orderId, "order ID");

  const session = await mongoose.startSession();

  try {
    let order;

    await session.withTransaction(async () => {
      const existingOrder = await populateOrderDocument(orderId, session);

      if (!existingOrder) {
        throw new Error("Order not found");
      }

      if (String(existingOrder.user?._id || existingOrder.user) !== String(userId)) {
        throw new Error("Access denied");
      }

      order = await finalizePaidOrderRecord({ orderId, payment, session });
    });

    return order;
  } catch (error) {
    if (error?.code === 11000 && payment?.razorpayPaymentId) {
      const existingOrder = await findOrderByPaymentId(payment.razorpayPaymentId);

      if (existingOrder) {
        if (String(existingOrder.user) !== String(userId)) {
          throw new Error("Duplicate payment reference");
        }

        return populateOrderDocument(existingOrder._id);
      }
    }

    if (isTransactionUnsupportedError(error)) {
      throw new Error(
        "Payment confirmation requires MongoDB transactions. Use a replica set or mongos deployment.",
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

const markOrderPaymentFailed = async (userId, orderId, payload = {}) => {
  if (!userId) {
    throw new Error("User is required");
  }

  ensureValidObjectId(userId, "user ID");
  ensureValidObjectId(orderId, "order ID");

  const order = await populateOrderDocument(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (String(order.user?._id || order.user) !== String(userId)) {
    throw new Error("Access denied");
  }

  if (order.payment?.status === PAID_PAYMENT_STATUS) {
    return order;
  }

  if (order.payment?.status === FAILED_PAYMENT_STATUS || order.status === FAILED_ORDER_STATUS) {
    return order;
  }

  if (order.status !== PENDING_ORDER_STATUS || order.payment?.status !== PENDING_PAYMENT_STATUS) {
    throw new Error("Order is not awaiting payment");
  }

  const now = new Date();
  await Order.updateOne(
    {
      _id: order._id,
      status: PENDING_ORDER_STATUS,
      "payment.status": PENDING_PAYMENT_STATUS,
    },
    {
      $set: {
        status: FAILED_ORDER_STATUS,
        failedAt: now,
        "payment.status": FAILED_PAYMENT_STATUS,
        "payment.failureReason": payload.failureReason || "Payment failed",
        "payment.lastAttemptAt": now,
        "payment.razorpayOrderId": payload.razorpayOrderId || order.payment?.razorpayOrderId,
        "payment.razorpayPaymentId": payload.razorpayPaymentId || order.payment?.razorpayPaymentId,
        "payment.razorpaySignature": payload.razorpaySignature || order.payment?.razorpaySignature,
      },
    },
  );

  return populateOrderDocument(order._id);
};

const getMyOrders = async (userId) => {
  if (!userId) {
    throw new Error("User is required");
  }

  return Order.find({ user: userId })
    .populate("items.product", "title price images")
    .sort({ createdAt: -1 });
};

const getOrderById = async (orderId) => {
  ensureValidObjectId(orderId, "order ID");

  const order = await Order.findById(orderId)
    .populate("user", "name email role")
    .populate("items.product", "title price images");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

const updateOrderStatus = async (orderId, status) => {
  ensureValidObjectId(orderId, "order ID");

  if (!ORDER_STATUSES.includes(status)) {
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.payment?.status !== PAID_PAYMENT_STATUS) {
    throw new Error("Only paid orders can enter fulfillment flow");
  }

  if (status === PENDING_ORDER_STATUS || status === FAILED_ORDER_STATUS) {
    throw new Error("Invalid fulfillment status transition");
  }

  if (status === "cancelled") {
    if (order.status === "delivered") {
      throw new Error("Order status cannot move backwards");
    }
  } else {
    const progressionStatuses = [PLACED_ORDER_STATUS, "shipped", "delivered"];
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

module.exports = {
  createOrder: createPendingOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  markOrderPaymentSucceeded,
  markOrderPaymentFailed,
};
