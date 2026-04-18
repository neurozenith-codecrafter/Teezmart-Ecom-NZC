const express = require("express");
const router = express.Router();
const { getAllOrders, updateOrderStatus } = require("../../Controllers/AdminOrderControllers");

router.get("/", getAllOrders);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
