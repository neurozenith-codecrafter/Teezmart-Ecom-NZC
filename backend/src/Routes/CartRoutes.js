const express = require("express");
const router = express.Router();

const cartController = require("../Controllers/CartControllers");
const { protect } = require("../Middleware/authMiddleware");

router.get("/", protect, cartController.getCart);
router.post("/", protect, cartController.addItem);
router.put("/", protect, cartController.updateItem);
router.delete("/:productId", protect, cartController.removeItem);
router.delete("/", protect, cartController.clearCart);

module.exports = router;