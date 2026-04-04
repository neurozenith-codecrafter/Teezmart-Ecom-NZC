const Product = require("../../Models/ProductSchema");
const cloudinary = require("../../Config/Cloudinary");
const mongoose = require("mongoose");

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // 2. Find product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 3. Delete images safely
    if (product.images?.length) {
      const deletePromises = product.images.map((img) =>
        cloudinary.uploader.destroy(img.public_id)
      );

      try {
        await Promise.all(deletePromises);
      } catch (cloudError) {
        console.error("Cloudinary deletion failed:", cloudError);
        return res.status(500).json({
          success: false,
          message: "Failed to delete product images",
        });
      }
    }

    // 4. Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

module.exports = { deleteProduct };