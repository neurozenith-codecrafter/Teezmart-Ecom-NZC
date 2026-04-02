const express = require("express");
const { TestController } = require("../Controllers/Test");

const router = express.Router();
router.post("/test", TestController);

module.exports = router;