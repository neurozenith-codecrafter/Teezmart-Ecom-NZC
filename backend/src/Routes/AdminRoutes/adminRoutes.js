const express = require("express");
const { protect } = require("../../Middleware/authMiddleware");
const { authorizeRoles } = require("../../Middleware/authMiddleware");
const User = require("../../Models/UserSchema");

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ["admin", "devAdmin"] },
    }).select("name email role createdAt");

    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admins" });
  }
});

router.use(protect, authorizeRoles("admin", "devAdmin"));

router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin dashboard", user: req.user });
});

router.use("/products", require("./adminProductRoutes"));
router.use("/users", require("./adminUserRoutes"));
router.use("/orders", require("../AdminRoutes/adminOrderRoutes"));

module.exports = router;
