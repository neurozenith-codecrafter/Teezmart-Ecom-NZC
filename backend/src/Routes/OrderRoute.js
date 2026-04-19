const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  markOrderPaymentSucceeded,
  markOrderPaymentFailed,
} = require("../Controllers/OrderController");
const { protect, authorizeRoles } = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.post("/:id/payment/success", protect, markOrderPaymentSucceeded);
router.post("/:id/payment/failure", protect, markOrderPaymentFailed);
router.get("/:id", protect, getOrderById);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "devAdmin"),
  updateOrderStatus
);

module.exports = router;
