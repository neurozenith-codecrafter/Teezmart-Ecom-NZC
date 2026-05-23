const Product = require("../Models/ProductSchema.js");

const normalize = require("../Utils/normalize");

const {
  createFuseInstance,
  getFuse
} = require("../Utils/fuse");


// Initialize once
const initializeSearch = async () => {

  const products = await Product.find({
    stock: { $gt: 0 }
  }).lean();

  createFuseInstance(products);

  console.log("Fuse search initialized");
};


// Search products
const searchProducts = async (query) => {

  if (!query?.trim()) {
    return [];
  }

  const fuse = getFuse();

  const normalizedQuery = normalize(query);

  const results = fuse.search(normalizedQuery);

  const formatted = results.map(result => {

    const product = result.item;

    // popularity boosting
    let popularityBoost = 0;

    popularityBoost += product.salesCount * 0.0005;

    popularityBoost += product.rating * 0.02;

    return {

      ...product,

      relevanceScore:
        (1 - result.score) + popularityBoost
    };
  });


  // final ranking
  formatted.sort(
    (a, b) => b.relevanceScore - a.relevanceScore
  );

  return formatted;
};

module.exports = {
  initializeSearch,
  searchProducts
};
