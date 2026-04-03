const Product = require("../../Models/ProductSchema");
const cloudinary = require("../../Config/Cloudinary");
const slugify = require("slugify");
const mongoose = require("mongoose");

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Find product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Extract fields from body
    const {
      title,
      description,
      price,
      discountPrice,
      category,
      stock,
      removeImages, // array of public_ids
    } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      price === undefined &&
      discountPrice === undefined &&
      category === undefined &&
      stock === undefined &&
      removeImages === undefined &&
      (!req.files || req.files.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    // BASIC FIELD UPDATES (partial)

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      product.title = title;
      product.slug = slugify(title, { lower: true });
    }

    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;

    const finalPrice = price !== undefined ? price : product.price;
    const finalDiscount = discountPrice !== undefined ? discountPrice : product.discountPrice;

    if (finalDiscount > finalPrice) {
      return res.status(400).json({
        success: false,
        message: "Discount price cannot exceed price",
      });
    }

    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (category !== undefined) product.category = category;

    // REMOVE SELECTED IMAGES
    let safeRemoveList = [];

    if (removeImages !== undefined) {
      // 1. Normalize to array
      let imagesToRemove = Array.isArray(removeImages)
        ? removeImages
        : [removeImages];

      // 2. Sanitize (remove invalid values)
      imagesToRemove = imagesToRemove.filter(
        (id) => typeof id === "string" && id.trim() !== ""
      );

      // 3. Validate against existing images
      const validPublicIds = new Set(
        product.images.map((img) => img.public_id)
      );

      safeRemoveList = imagesToRemove.filter((id) =>
        validPublicIds.has(id)
      );

      // 4. Only proceed if there's something valid
      if (safeRemoveList.length > 0) {
        // Delete from Cloudinary
        await Promise.all(
          safeRemoveList.map((public_id) =>
            cloudinary.uploader.destroy(public_id)
          )
        );

        // Remove from DB
        product.images = product.images.filter(
          (img) => !safeRemoveList.includes(img.public_id)
        );
      }
    }

    // CHECK IMAGE COUNT LIMIT
    const currentImageCount = product.images.length;
    const newImageCount = req.files ? req.files.length : 0;

    if (currentImageCount + newImageCount > 5) {
      return res.status(400).json({
        success: false,
        message: "Total images cannot exceed 5",
      });
    }

    // ADD NEW IMAGES
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          );
          stream.end(file.buffer);
        })
      );

      const newImages = await Promise.all(uploadPromises);

      product.images.push(...newImages);
    }

    // VALIDATION (IMPORTANT)
    if (product.discountPrice > product.price) {
      return res.status(400).json({
        success: false,
        message: "Discount price cannot exceed price",
      });
    }

    // SAVE
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

module.exports = { updateProduct };