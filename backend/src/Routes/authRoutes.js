const express = require("express");
const router = express.Router();
const { googleAuth } = require("../Controllers/authController");

router.post("/google", googleAuth);

module.exports = router;
