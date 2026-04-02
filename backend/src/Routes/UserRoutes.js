const express = require("express");
const router = express.Router();
// const protect = require("../Middleware/authMiddleware.js");

const { TestController } = require("../Controllers/Test.js");

router.post("/test", TestController);
// router.get("/profile", protect, getProfile);

module.exports = router;
