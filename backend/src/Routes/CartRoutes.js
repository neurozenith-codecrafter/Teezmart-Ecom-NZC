const express = require("express");
const router = express.Router();

const cartController = require("../Controllers/CartControllers");
const { protect } = require("../Middleware/authMiddleware");

router.get("/", protect, cartController.getCart);
router.post("/", protect, cartController.addItem);
router.put("/", protect, cartController.updateItem);
router.delete("/", protect, cartController.clearCart);
router.delete("/:productId", protect, cartController.removeItem);

module.exports = router;