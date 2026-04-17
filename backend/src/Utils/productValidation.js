const slugify = require("slugify");
const { CATEGORIES } = require("../Constants/constant.js");

const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const normalizeCategory = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const validateCategory = (value) => {
  const normalizedCategory = normalizeCategory(value);

  if (!normalizedCategory || !CATEGORIES.includes(normalizedCategory)) {
    throw new Error("Invalid category");
  }

  return normalizedCategory;
};

const validateTitle = (value) => {
  if (typeof value !== "string") {
    throw new Error("Title is required and must be less than 120 characters");
  }

  const normalizedTitle = value.trim();

  if (!normalizedTitle || normalizedTitle.length > 120) {
    throw new Error("Title is required and must be less than 120 characters");
  }

  return normalizedTitle;
};

const validateDescription = (value) => {
  if (typeof value !== "string") {
    throw new Error("Description is required and must be less than 2000 characters");
  }

  const normalizedDescription = value.trim();

  if (!normalizedDescription || normalizedDescription.length > 2000) {
    throw new Error("Description is required and must be less than 2000 characters");
  }

  return normalizedDescription;
};

const parsePrice = (value, fieldName = "Price") => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    throw new Error(`${fieldName} must be a valid non-negative number`);
  }

  return parsedValue;
};

const parseOptionalDiscountPrice = (value, price) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsedDiscountPrice = Number(value);

  if (!Number.isFinite(parsedDiscountPrice) || parsedDiscountPrice < 0) {
    throw new Error("Discount price must be a valid non-negative number");
  }

  if (parsedDiscountPrice >= price) {
    throw new Error("Discount price must be less than price");
  }

  return parsedDiscountPrice;
};

const normalizeSizes = (value) => {
  if (value === undefined) {
    return undefined;
  }

  const inputSizes = Array.isArray(value) ? value : [value];

  const normalizedSizes = inputSizes.map((size) => {
    if (typeof size !== "string") {
      throw new Error("Sizes must contain only strings");
    }

    return size.trim().toUpperCase();
  }).filter(Boolean);

  const uniqueSizes = [...new Set(normalizedSizes)];

  if (uniqueSizes.some((size) => !ALLOWED_SIZES.includes(size))) {
    throw new Error(`Sizes must be one of: ${ALLOWED_SIZES.join(", ")}`);
  }

  return uniqueSizes;
};

const normalizeRemoveImages = (value) => {
  if (value === undefined) {
    return [];
  }

  const imageIds = Array.isArray(value) ? value : [value];

  return [...new Set(imageIds
    .filter((imageId) => typeof imageId === "string")
    .map((imageId) => imageId.trim())
    .filter(Boolean))];
};

const createSlugFromTitle = (title) =>
  slugify(title, { lower: true, strict: true, trim: true });

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = {
  ALLOWED_SIZES,
  normalizeCategory,
  validateCategory,
  validateTitle,
  validateDescription,
  parsePrice,
  parseOptionalDiscountPrice,
  normalizeSizes,
  normalizeRemoveImages,
  createSlugFromTitle,
  escapeRegex,
};
