const Product = require("../../Models/ProductSchema");

// Controller to create a new product (for admin use)
const createProduct = async (req, res) => {
  try {

    let { title, description, price, discountPrice, category, images } = req.body;

    // Trim strings
    title = title?.trim();
    description = description?.trim();
    category = category?.trim();

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required",
      });
    }

    // Validate price and discountPrice
    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    // Discount price is validated over actual price
    if (discountPrice && discountPrice >= price) {
      return res.status(400).json({
        success: false,
        message: "Discount price must be less than actual price",
      });
    }

    // Validate images array
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Create product
    const product = await Product.create({
      title,
      description,
      price,
      discountPrice,
      category,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
}