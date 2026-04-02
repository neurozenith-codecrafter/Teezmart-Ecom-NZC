const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const { isAdmin } = require("../Middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", protect, isAdmin, (req, res) => {
  res.json({ message: "Admin dashboard", user: req.user });
});

module.exports = router;
