const express = require("express");
const router = express.Router();
const { googleAuth } = require("../Controllers/authController");
const {
  protect,
  getMe,
  authorizeRoles,
} = require("../Middleware/authMiddleware");

router.post("/google", googleAuth);

router.get("/me", protect, getMe);

module.exports = router;
