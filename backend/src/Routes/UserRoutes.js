const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
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


module.exports = router;
