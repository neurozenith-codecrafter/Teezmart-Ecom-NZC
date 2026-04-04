const express = require("express");
const { protect } = require("../../Middleware/authMiddleware");
const { authorizeRoles } = require("../../Middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin", "devAdmin"));

router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin dashboard", user: req.user });
});

router.use("/products", require("./adminProductRoutes"));
router.use("/users", require("./adminUserRoutes"));

module.exports = router;
