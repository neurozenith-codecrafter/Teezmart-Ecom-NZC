const express = require("express");
const router = express.Router();

const { TestController } = require("../Controllers/Test.js");

router.post("/test", TestController);

module.exports = router;