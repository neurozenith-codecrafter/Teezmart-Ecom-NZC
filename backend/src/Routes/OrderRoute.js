const express = require("express");
const { createOrder } = require("../controllers/order.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createOrder);

module.exports = router;