const Product = require("../Models/ProductSchema.js");

const normalize = require("../Utils/normalize");

const {
  createFuseInstance,
  getFuse
} = require("../Utils/fuse");

const {
  generateSuggestions
} = require("../Utils/suggestions");


// Initialize once
const initializeSearch = async () => {

  const products = await Product.find({
    stock: { $gt: 0 }
  }).lean();

  createFuseInstance(products);

  console.log("✅ Fuse search initialized");
};


// Search products
const searchProducts = async (query) => {

  if (!query?.trim()) {

    return {
      suggestions: [],
      products: []
    };
  }

  const fuse = getFuse();

  const normalizedQuery = normalize(query);

  const results = fuse.search(normalizedQuery, {
    limit: 10
  });

  const products = results
    .map(result => {

      const product = result.item;

      // Fuse relevance
      const fuseScore = 1 - (result.score || 0);

      // Popularity boosting
      const popularityBoost =
        Math.log10(
          (product.salesCount || 0) + 1
        ) * 0.15;

      // Rating boosting
      const ratingBoost =
        (product.rating || 0) * 0.05;

      // Final score
      const relevanceScore =
        fuseScore +
        popularityBoost +
        ratingBoost;

      return {

        _id: product._id,

        title: product.title,

        slug: product.slug,

        image: product.images?.[0],

        price:
          product.discountPrice ||
          product.price,

        rating: product.rating,

        relevanceScore:
          Number(
            relevanceScore.toFixed(3)
          )
      };
    })

    .sort(
      (a, b) =>
        b.relevanceScore - a.relevanceScore
    );

  const suggestions =
    generateSuggestions(
      results,
      normalizedQuery
    );

  return {
    suggestions,
    products
  };
};

module.exports = {
  initializeSearch,
  searchProducts
};