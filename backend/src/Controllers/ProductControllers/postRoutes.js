// Controller to create a new product (for admin use)

const Product = require("../../Models/ProductSchema");
const cloudinary = require("../../Config/Cloudinary");
const streamifier = require("streamifier");
const {
  validateCategory,
  validateDescription,
  validateTitle,
  parsePrice,
  parseOptionalNonNegativeNumber,
  normalizeSizes,
  createSlugFromTitle,
} = require("../../Utils/productValidation");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const createProduct = async (req, res) => {
  let uploadedImagePublicIds = [];

  try {
    let { title, description, price, discountPrice, category, sizes } = req.body;
    title = validateTitle(title);
    description = validateDescription(description);
    price = parsePrice(price);
    discountPrice = parseOptionalNonNegativeNumber(discountPrice, "Discount price");
    const normalizedCategory = validateCategory(category);
    sizes = normalizeSizes(sizes);
    const slug = createSlugFromTitle(title);

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image required",
      });
    }

    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this title already exists",
      });
    }

    // Upload images
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );

    const results = await Promise.all(uploadPromises);
    uploadedImagePublicIds = results.map((img) => img.public_id);

    const images = results.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    const product = await Product.create({
      title,
      slug,
      description,
      price,
      discountPrice,
      category: normalizedCategory,
      sizes,
      images,
    });

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    if (uploadedImagePublicIds.length > 0) {
      await Promise.allSettled(
        uploadedImagePublicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
      );
    }

    const statusCode =
      error.message === "Title is required and must be less than 120 characters" ||
      error.message === "Description is required and must be less than 2000 characters" ||
      error.message === "Invalid category" ||
      error.message === "Price must be a valid non-negative number" ||
      error.message === "Discount price must be a valid non-negative number" ||
      error.message === "Sizes must contain only strings" ||
      error.message.startsWith("Sizes must be one of:")
        ? 400
        : error.code === 11000
          ? 409
          : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createProduct };
