const express = require("express");
const router = express.Router();

const { createProduct } = require("../../Controllers/ProductControllers/postRoutes.js");
const upload = require("../../Middleware/upload.js");

const { deleteProduct } = require("../../Controllers/ProductControllers/deleteRoutes.js");
const { updateProduct } = require("../../Controllers/ProductControllers/putRoutes.js");


// POST /api/products

// `POST /api/products` - Create a new product (admin use)
router.post("/add", upload.array("images", 5), createProduct);

// `DELETE /api/products/:id` - Delete a product by ID (admin use)
router.delete("/delete/:id", deleteProduct);

// `PUT /api/products/:id` - Update a product by ID (admin use) - handled in ProductControllers/putRoutes.js
router.put("/update/:id", upload.array("images", 5), updateProduct);

module.exports = router;