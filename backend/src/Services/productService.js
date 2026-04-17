const Product = require("../Models/ProductSchema");

const getFilteredProducts = async ({ category, collection, sizes, sort }) => {
  const query = {};

  // 🔹 Category Filter
  if (category) {
    query.category = category;
  }

  // 🔹 Collection Mapping
  if (collection === "best") {
    query.salesCount = { $gte: 50 };
  }

  if (collection === "rated") {
    query.rating = { $gte: 3.5 };
    query.numReviews = { $gt: 0 };
  }

  // 🔹 Sizes Filter
  if (sizes) {
    const sizeArray = sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (sizeArray.length) {
      query.sizes = { $in: sizeArray };
    }
  }

  // 🔹 Sorting
  const sortMap = {
    new: { createdAt: -1 },
    rating_desc: { rating: -1 },
  };

  let sortQuery = sortMap[sort] || { createdAt: -1 };

  // 🔹 Underrated
  if (sort === "underrated") {
    query.rating = { $gte: 3.5 };
    query.numReviews = { $lte: 20 };
    sortQuery = { rating: -1 };
  }

  const products = await Product.find(query).sort(sortQuery).limit(100).lean();

  return {
    products,
    count: products.length,
  };
};

module.exports = {
  getFilteredProducts,
};
