const express = require("express");
const { getAllProducts } = require("../Controllers/ProductControllers");

const router = express.Router();

router.get("/getAllProducts", getAllProducts);

module.exports = router;