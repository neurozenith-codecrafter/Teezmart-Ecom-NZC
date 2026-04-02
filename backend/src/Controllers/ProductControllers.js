const Product = require("../Models/ProductSchema");

const getAllProducts = async (req, res) => {
  try {

    const products = await Product.find({});

    if (!products || products.length === 0) res.status(404).json({ success: false, message: "No products found" });

    else res.status(200).json({ success: true, message: "Products fetched successfully", data: products });

  } catch (error) {

    res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });

  }
}

module.exports = {
  getAllProducts
}