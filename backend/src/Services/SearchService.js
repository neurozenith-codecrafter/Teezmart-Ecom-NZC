const Product = require("../Models/ProductSchema.js");

const normalize = require("../Utils/normalize");

const {
  createFuseInstance,
  getFuse
} = require("../Utils/fuse");

const {
  generateSuggestions
} = require("../Utils/suggestions");


const initializeSearch = async () => {

  const products = await Product.find({
    stock: { $gt: 0 }
  }).lean();

  createFuseInstance(products);

  console.log("✅ Fuse search initialized");
};


const searchProducts = async (query) => {

  if (!query?.trim()) {
    return [];
  }

  const fuse = getFuse();

  const normalizedQuery =
    normalize(query);

  const results =
    fuse.search(normalizedQuery, {
      limit: 20
    });

  const products = results

    .map(result => {

      const product = result.item;

      const fuseScore =
        1 - (result.score || 0);

      const popularityBoost =
        Math.log10(
          (product.salesCount || 0) + 1
        ) * 0.15;

      const ratingBoost =
        (product.rating || 0) * 0.05;

      const relevanceScore =
        fuseScore +
        popularityBoost +
        ratingBoost;

      return {

        _id: product._id,

        title: product.title,

        slug: product.slug,

        image: product.image,

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

  return products;
};


const getSuggestions = async (query) => {

  if (!query?.trim()) {
    return [];
  }

  const fuse = getFuse();

  const normalizedQuery =
    normalize(query);

  const results =
    fuse.search(normalizedQuery, {
      limit: 8
    });

  return generateSuggestions(
    results,
    normalizedQuery
  );
};


module.exports = {
  initializeSearch,
  searchProducts,
  getSuggestions
};