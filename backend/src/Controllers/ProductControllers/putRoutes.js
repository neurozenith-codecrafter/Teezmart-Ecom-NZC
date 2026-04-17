const Product = require("../../Models/ProductSchema");
const cloudinary = require("../../Config/Cloudinary");
const mongoose = require("mongoose");
const streamifier = require("streamifier");
const {
  validateCategory,
  validateDescription,
  validateTitle,
  parsePrice,
  parseOptionalDiscountPrice,
  normalizeSizes,
  normalizeRemoveImages,
  createSlugFromTitle,
} = require("../../Utils/productValidation");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const updateProduct = async (req, res) => {
  let uploadedImagePublicIds = [];

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
      stock,
      discountPrice,
      category,
      sizes,
      removeImages, // array of public_ids
    } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      price === undefined &&
      stock === undefined &&
      discountPrice === undefined &&
      category === undefined &&
      sizes === undefined &&
      removeImages === undefined &&
      (!req.files || req.files.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    let nextTitle = product.title;
    let nextSlug = product.slug;
    let nextDescription = product.description;
    let nextPrice = product.price;
    let nextStock = product.stock;
    let nextDiscountPrice = product.discountPrice;
    let nextCategory = product.category;
    let nextSizes = product.sizes;

    if (title !== undefined) {
      nextTitle = validateTitle(title);
      nextSlug = createSlugFromTitle(nextTitle);
    }

    if (description !== undefined) {
      nextDescription = validateDescription(description);
    }

    if (price !== undefined) {
      nextPrice = parsePrice(price);
    }

    if (stock !== undefined) {
      const normalizedStock = Number(stock);

      if (!Number.isInteger(normalizedStock) || normalizedStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative integer",
        });
      }

      nextStock = normalizedStock;
    }

    if (discountPrice !== undefined) {
      nextDiscountPrice =
        discountPrice === "" || discountPrice === null
          ? undefined
          : parseOptionalDiscountPrice(discountPrice, nextPrice);
    }

    if (nextDiscountPrice !== undefined && nextDiscountPrice >= nextPrice) {
      return res.status(400).json({
        success: false,
        message: "Discount price must be less than price",
      });
    }

    if (category !== undefined) {
      nextCategory = validateCategory(category);
    }

    if (sizes !== undefined) {
      nextSizes = normalizeSizes(sizes);
    }

    if (nextSlug !== product.slug) {
      const conflictingProduct = await Product.findOne({
        slug: nextSlug,
        _id: { $ne: product._id },
      });

      if (conflictingProduct) {
        return res.status(409).json({
          success: false,
          message: "Another product with this title already exists",
        });
      }
    }

    // REMOVE SELECTED IMAGES
    const normalizedRemoveImages = normalizeRemoveImages(removeImages);
    const validPublicIds = new Set(product.images.map((img) => img.public_id));
    const safeRemoveList = normalizedRemoveImages.filter((publicId) =>
      validPublicIds.has(publicId),
    );
    const currentImageCount = product.images.length;
    const newImageCount = req.files ? req.files.length : 0;
    const finalImageCount = currentImageCount - safeRemoveList.length + newImageCount;

    if (finalImageCount > 5) {
      return res.status(400).json({
        success: false,
        message: "Total images cannot exceed 5",
      });
    }

    if (finalImageCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Product must have at least one image",
      });
    }

    // ADD NEW IMAGES
    let newImages = [];

    if (req.files && req.files.length > 0) {
      newImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer)),
      );
      uploadedImagePublicIds = newImages.map((image) => image.public_id);
    }

    product.title = nextTitle;
    product.slug = nextSlug;
    product.description = nextDescription;
    product.price = nextPrice;
    product.stock = nextStock;
    product.discountPrice = nextDiscountPrice;
    product.category = nextCategory;
    product.sizes = nextSizes;
    product.images = [
      ...product.images.filter((img) => !safeRemoveList.includes(img.public_id)),
      ...newImages,
    ];

    // SAVE
    await product.save();

    if (safeRemoveList.length > 0) {
      await Promise.all(
        safeRemoveList.map((publicId) => cloudinary.uploader.destroy(publicId)),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    if (uploadedImagePublicIds.length > 0) {
      await Promise.allSettled(
        uploadedImagePublicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
      );
    }

    const statusCode =
      error.message === "Invalid product ID" ||
      error.message === "Title is required and must be less than 120 characters" ||
      error.message === "Description is required and must be less than 2000 characters" ||
      error.message === "Invalid category" ||
      error.message === "Price must be a valid number greater than 0" ||
      error.message === "Stock must be a non-negative integer" ||
      error.message === "Discount price must be a valid non-negative number" ||
      error.message === "Discount price must be less than price" ||
      error.message === "Total images cannot exceed 5" ||
      error.message === "Product must have at least one image" ||
      error.message === "Sizes must contain only strings" ||
      error.message.startsWith("Sizes must be one of:")
        ? 400
        : error.code === 11000
          ? 409
          : 500;

    return res.status(statusCode).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

module.exports = { updateProduct };
