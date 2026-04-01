const express = require("express");
const router = express.Router();

const { TestController } = require("../../Controllers/UserControllers/Test");

router.post("/test", TestController);

module.exports = router;