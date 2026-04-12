const express = require("express");
const router = express.Router();
const { getAllOrders } = require("../../Controllers/AdminOrderControllers");

router.get("/", getAllOrders);

module.exports = router;
