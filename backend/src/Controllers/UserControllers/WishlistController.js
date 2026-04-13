const wishlistService = require("../../Services/wishlistServices");

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const result = await wishlistService.toggleWishlist(req.user.id, productId);

    return res.status(200).json({
      success: true,
      message: result.isWishlisted
        ? "Product added to wishlist"
        : "Product removed from wishlist",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update wishlist",
      data: null,
    });
  }
};

const addWishlistItem = async (req, res) => {
  try {
    const productId = req.params.productId || req.body.productId;
    const result = await wishlistService.addToWishlist(req.user.id, productId);

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to add wishlist item",
      data: null,
    });
  }
};

const removeWishlistItem = async (req, res) => {
  try {
    const productId = req.params.productId || req.body.productId;
    const result = await wishlistService.removeFromWishlist(req.user.id, productId);

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to remove wishlist item",
      data: null,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch wishlist",
      data: null,
    });
  }
};

module.exports = {
  toggleWishlist,
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
};
