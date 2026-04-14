const Product = require("../../Models/ProductSchema");
const mongoose = require("mongoose");
const { validateCategory } = require("../../Utils/productValidation");

// `GET /api/products` - Fetch all products with new and top-rated sections
const getAllProducts = async (req, res) => {
  try {
    const NEW_LIMIT = 3;
    const TOP_LIMIT = 6;

    // 1. New products
    const newProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(NEW_LIMIT);

    // 2. Top rated (excluding new ones)
    const newIds = newProducts.map((p) => p._id);

    const topRated = await Product.find({
      _id: { $nin: newIds },
    })
      .sort({ rating: -1 })
      .limit(TOP_LIMIT);

    // 3. Others
    const usedIds = [...newIds, ...topRated.map((p) => p._id)];

    const others = await Product.find({
      _id: { $nin: usedIds },
    }).sort({ createdAt: -1 });

    const taggedNew = newProducts.map((p) => ({ ...p.toObject(), tag: "new" }));
    const taggedTop = topRated.map((p) => ({ ...p.toObject(), tag: "top" }));
    const taggedOthers = others.map((p) => ({
      ...p.toObject(),
      tag: "others",
    }));

    const combinedProducts = [...taggedNew, ...taggedTop, ...taggedOthers];

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: combinedProducts, // ✅ single array
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// `GET /api/products/:slug` - Fetch product details by slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const normalizedSlug =
      typeof slug === "string" ? slug.trim().toLowerCase() : "";

    if (!normalizedSlug) {
      return res.status(400).json({
        success: false,
        message: "Product slug is required",
      });
    }

    const product = await Product.findOne({ slug: normalizedSlug });

    // Not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the product",
      error: error.message,
    });
  }
};

// `GET /api/products?sort=most-reviewed` - Fetch products sorted by number of reviews
const getMostReviewedProducts = async (req, res) => {
  try {
    // const LIMIT = 10; // optional

    // Fetch products sorted by number of reviews in descending order
    const products = await Product.find({}).sort({ numReviews: -1 });
    // .limit(LIMIT);

    return res.status(200).json({
      success: true,
      message: "Most reviewed products fetched successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch most reviewed products",
      error: error.message,
    });
  }
};

// `GET /api/products/most-selling` - Fetch products sorted by sales count
const getMostSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({
      salesCount: -1,
      rating: -1,
    }); // tie-breaker
    // Sort by salesCount in descending order, and use rating as a tie-breaker

    return res.status(200).json({
      success: true,
      message: "Most selling products fetched successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch most selling products",
      error: error.message,
    });
  }
};

// `GET /api/products/category/:category` - Fetch products by category
const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category || req.query.category;

    // Validate category parameter
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category query parameter is required",
      });
    }

    const normalizedCategory = validateCategory(category);

    // Getting products that match the category safely
    const products = await Product.find({
      category: normalizedCategory,
    }).sort({ createdAt: -1, rating: -1 });

    // Response if no products found for the category
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found in category '${normalizedCategory}'`,
      });
    }

    // Success response with products in the specified category
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully by category",
      count: products.length,
      data: products,
    });
  } catch (error) {
    const statusCode = error.message === "Invalid category" ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message: "Failed to fetch products by category",
      error: error.message,
    });
  }
};

// `GET /api/products/recommended` - Fetch recommended products based on rating and reviews for homepage
const getRecommendedProducts = async (req, res) => {
  try {
    const recommendedProducts = await Product.find({})
      .sort({ rating: -1, numReviews: -1, createdAt: -1 })
      .limit(8);

    return res.status(200).json({
      success: true,
      message: "Recommended products fetched successfully",
      count: recommendedProducts.length,
      data: recommendedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommended products",
      error: error.message,
    });
  }
};

// Helper function to shuffle an array (Fisher-Yates algorithm) - Used in getProductSuggestions controller
const shuffleArray = (array) => {
  // Fisher-Yates (better than sort random)
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Controller to get product suggestions based on a given product ID to show in the product details page
const getProductSuggestions = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 1. Get current product
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Get similar products (same category, exclude current)
    const products = await Product.find({
      category: currentProduct.category,
      _id: { $ne: id },
    }).sort({ rating: -1, numReviews: -1 });

    // 3. Split into top 8 and rest
    const topProducts = products.slice(0, 8);
    const restProducts = products.slice(8);

    // 4. Randomly pick 4 from top, 6 from rest
    const selectedTop = shuffleArray([...topProducts]).slice(0, 4);
    const selectedRest = shuffleArray([...restProducts]).slice(0, 6);

    // 5. Combine
    let combined = [...selectedTop, ...selectedRest];

    // 6. LIGHT shuffle (keep some structure)
    // Shuffle only partially (first 6 positions)
    const firstHalf = shuffleArray(combined.slice(0, 6));
    const secondHalf = shuffleArray(combined.slice(6));

    const finalSuggestions = [...firstHalf, ...secondHalf];

    return res.status(200).json({
      success: true,
      message: "Product suggestions fetched successfully",
      count: finalSuggestions.length,
      data: finalSuggestions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product suggestions",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  getMostReviewedProducts,
  getMostSellingProducts,
  getProductsByCategory,
  getRecommendedProducts,
  getProductSuggestions,
};
