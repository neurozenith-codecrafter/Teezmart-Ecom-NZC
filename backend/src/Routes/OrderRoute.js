const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require("../Controllers/OrderController");
const { protect, authorizeRoles } = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "devAdmin"),
  updateOrderStatus
);

module.exports = router;
