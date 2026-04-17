const Product = require("../Models/ProductSchema");

const getFilteredProducts = async ({ collection, sizes, sort }) => {
  const query = {};

  // 🔹 Collection Mapping
  if (collection === "best") {
    query.salesCount = { $gte: 50 }; // threshold (adjust later)
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

  // 🔹 Underrated (based on YOUR schema)
  if (sort === "underrated") {
    query.rating = { $gte: 3.5 };
    query.numReviews = { $lte: 20 }; // using YOUR field
    sortQuery = { rating: -1 };
  }

  // 🔹 Execute
  const products = await Product.find(query)
    .sort(sortQuery)
    .limit(100) // safety cap
    .lean();

  return {
    products,
    count: products.length,
  };
};

module.exports = {
  getFilteredProducts,
};
