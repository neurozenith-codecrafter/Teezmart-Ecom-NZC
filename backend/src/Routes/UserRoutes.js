const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserAddresses,
} = require("../Controllers/UserProfileController.js");
const { protect } = require("../Middleware/authMiddleware.js");
const { deleteUserAccount } = require("../Controllers/UserControllers/deleteRoutes.js");
const {
  toggleWishlist,
  getWishlist,
} = require("../Controllers/UserControllers/WishlistController.js");


router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserAccount);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, toggleWishlist);
router.put("/profile/:id/address", protect, updateUserAddresses);


module.exports = router;
