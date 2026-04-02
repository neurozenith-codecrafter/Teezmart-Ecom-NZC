const express = require("express");
const {
  getAllProducts,
  getProductById,
} = require("../Controllers/ProductControllers/getRoutes.js");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;
