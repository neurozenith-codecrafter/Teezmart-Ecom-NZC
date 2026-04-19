const mongoose = require("mongoose");
const { ORDER_STATUSES, PAYMENT_STATUSES } = require("../Constants/constant");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    phone: { type: String, required: true },

    addressLine1: { type: String, required: true }, // house/building
    addressLine2: { type: String }, // street/locality

    landmark: { type: String },

    city: { type: String, required: true },
    state: { type: String, required: true },

    pincode: { type: String, required: true },

    country: { type: String, default: "India" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(val) => val.length > 0, "Order must have at least one item"],
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    checkoutFingerprint: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },

    payment: {
      method: {
        type: String,
        enum: ["razorpay"],
        default: "razorpay",
      },
      status: {
        type: String,
        enum: PAYMENT_STATUSES,
        default: "pending",
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      failureReason: String,
      lastAttemptAt: Date,
    },

    stockReservedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    totalAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      shippingFee: { type: Number, default: 0 },
      total: { type: Number, required: true, min: 0 },
    },
  },
  { timestamps: true },
);

orderSchema.index(
  { user: 1, checkoutFingerprint: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "pending",
      "payment.status": "pending",
    },
  },
);

orderSchema.index(
  { "payment.razorpayPaymentId": 1 },
  {
    unique: true,
    sparse: true,
  },
);

orderSchema.index({ status: 1, "payment.status": 1, createdAt: -1 });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
