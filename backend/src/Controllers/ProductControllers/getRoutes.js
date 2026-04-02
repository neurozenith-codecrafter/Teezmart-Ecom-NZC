const mongoose = require("mongoose");
const Product = require("../../Models/ProductSchema");

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

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
        newProducts,
        topRated,
        others,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

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

module.exports = {
  getAllProducts,
  getProductById
};
