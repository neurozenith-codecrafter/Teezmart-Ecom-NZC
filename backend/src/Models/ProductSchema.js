const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    category: {
      type: String,
      required: true,
    },

    images: [String],

    // Stores the average rating of the product based on user reviews
    rating: {
      type: Number,
      default: 0,
    },

    // Stores the total number of reviews for the product
    numReviews: {
      type: Number,
      default: 0,
    },

    // Stores the breakdown of ratings (1 to 5 stars) for the product
    ratingsBreakdown: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
