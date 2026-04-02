const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  discountPrice: {
    type: Number
  },

  category: {
    type: String,
    required: true
  },

  images: [String],

  rating: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);