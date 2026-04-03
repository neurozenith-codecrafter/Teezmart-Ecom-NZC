// Controller to create a new product (for admin use)

const Product = require("../../Models/ProductSchema");
const cloudinary = require("../../Config/Cloudinary");
const streamifier = require("streamifier");
const slugify = require("slugify");
const { CATEGORIES } = require("../../Constants/constant.js");

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

const normalizeCategory = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const createProduct = async (req, res) => {
  try {
    let { title, description, price, discountPrice, category } = req.body;

    // 🔥 Validate title
    if (!title || title.trim().length === 0 || title.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Title is required and must be < 120 chars",
      });
    }

    // 🔥 Generate slug
    const slug = slugify(title, { lower: true });

    // 🔥 Validate description
    if (!description || description.trim().length === 0 || description.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Description must be < 2000 chars",
      });
    }

    // 🔥 Parse numbers
    price = Number(price);
    discountPrice = discountPrice ? Number(discountPrice) : undefined;

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }

    if (discountPrice && (isNaN(discountPrice) || discountPrice >= price)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount price",
      });
    }

    // 🔥 Normalize category
    const normalizedCategory = normalizeCategory(category);

    if (!CATEGORIES.includes(normalizedCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    // 🔥 Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image required",
      });
    }

    // 🔥 Upload images
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );

    const results = await Promise.all(uploadPromises);

    const images = results.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    const product = await Product.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      price,
      discountPrice,
      category: normalizedCategory,
      images,
    });

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createProduct };