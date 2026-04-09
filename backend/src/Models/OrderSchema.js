const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: {
      type: [orderItemSchema],
      validate: [(val) => val.length > 0, "Order must have at least one item"]
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },

    payment: {
      method: { type: String, default: "COD" },
      status: { type: String, default: "pending" }
    },

    delivery: {
      type: {
        type: String,
        default: "standard"
      },
      status: {
        type: String,
        enum: ["processing", "shipped", "delivered"],
        default: "processing"
      }
    },

    pricing: {
      subtotal: { type: Number, required: true },
      shippingFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);