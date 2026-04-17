const User = require("../Models/UserSchema");
const Product = require("../Models/ProductSchema");
const { ensureValidObjectId } = require("../Utils/validation");

const WISHLIST_PRODUCT_SELECT = [
  "title",
  "slug",
  "price",
  "discountPrice",
  "images",
  "category",
  "rating",
  "numReviews",
  "sizes",
  "salesCount",
].join(" ");

const ensureUserExists = async (userId) => {
  ensureValidObjectId(userId, "user ID");

  const user = await User.findOne({ _id: userId, isActive: true }).select("_id");

  if (!user) {
    throw new Error("User not found");
  }
};

const ensureProductExists = async (productId) => {
  ensureValidObjectId(productId, "product ID");

  const product = await Product.findById(productId).select("_id");

  if (!product) {
    throw new Error("Product not found");
  }
};

const isWishlisted = async (userId, productId) => {
  ensureValidObjectId(userId, "user ID");
  ensureValidObjectId(productId, "product ID");

  const existing = await User.exists({
    _id: userId,
    isActive: true,
    wishlist: productId,
  });

  return Boolean(existing);
};

const getWishlist = async (userId) => {
  await ensureUserExists(userId);

  const user = await User.findById(userId)
    .select("wishlist")
    .populate({
      path: "wishlist",
      select: WISHLIST_PRODUCT_SELECT,
      options: { lean: true },
    })
    .lean();

  const items = (user?.wishlist || []).filter(Boolean);

  return {
    items,
    count: items.length,
  };
};

const toggleWishlist = async (userId, productId) => {
  await ensureUserExists(userId);
  ensureValidObjectId(productId, "product ID");

  const alreadyWishlisted = await isWishlisted(userId, productId);

  if (alreadyWishlisted) {
    await User.updateOne(
      { _id: userId },
      { $pull: { wishlist: productId } },
    );

    return {
      productId,
      isWishlisted: false,
    };
  }

  await ensureProductExists(productId);

  await User.updateOne(
    { _id: userId },
    { $addToSet: { wishlist: productId } },
  );

  return {
    productId,
    isWishlisted: true,
  };
};

const addToWishlist = async (userId, productId) => {
  await ensureUserExists(userId);
  await ensureProductExists(productId);

  await User.updateOne(
    { _id: userId },
    { $addToSet: { wishlist: productId } },
  );

  return {
    productId,
    isWishlisted: true,
  };
};

const removeFromWishlist = async (userId, productId) => {
  await ensureUserExists(userId);
  ensureValidObjectId(productId, "product ID");

  await User.updateOne(
    { _id: userId },
    { $pull: { wishlist: productId } },
  );

  return {
    productId,
    isWishlisted: false,
  };
};

module.exports = {
  toggleWishlist,
  getWishlist,
  isWishlisted,
  addToWishlist,
  removeFromWishlist,
};
