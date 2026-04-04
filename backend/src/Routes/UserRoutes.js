const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../Controllers/UserControllers/getRoutes.js");
const { protect } = require("../Middleware/authMiddleware.js");
const { updateUserProfile } = require("../Controllers/UserControllers/putRoutes.js");
const { deleteUserAccount } = require("../Controllers/UserControllers/deleteRoutes.js");


router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserAccount);

module.exports = router;
