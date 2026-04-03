const express = require("express");
const {
  getAllProducts,
  getProductById,
  getMostReviewedProducts,
  getMostSellingProducts,
  getProductsByCategory,
  getRecommendedProducts,
  getProductSuggestions,
} = require("../Controllers/ProductControllers/getRoutes.js");

const { createProduct } = require("../Controllers/ProductControllers/postRoutes.js");
const upload = require("../Middleware/upload.js");

const router = express.Router();

// GET /api/products

// `GET /api/products` - Fetch all products with new and top-rated sections
router.get("/", getAllProducts);

// `GET /api/products/:id` - Fetch product details by ID
router.get("/:id", getProductById);

// `GET /api/products?sort=most-reviewed` - Fetch products sorted by number of reviews
router.get("/most-reviewed", getMostReviewedProducts);

// `GET /api/products?sort=most-selling` - Fetch products sorted by sales count
router.get("/most-selling", getMostSellingProducts);

// `GET /api/products/category/:category` - Fetch products by category
router.get("/category/:category", getProductsByCategory);

// `GET /api/products/recommended` - Fetch recommended products based on rating and reviews for homepage (Top 10)
router.get("/recommended", getRecommendedProducts);

// `GET /api/products/:id/suggestions` - Fetch product suggestions based on a given product ID to show in the product details page
router.get("/:id/suggestions", getProductSuggestions);

// POST /api/products

// `POST /api/products` - Create a new product (admin use)
router.post("/add", upload.array("images", 5), createProduct);

module.exports = router;
