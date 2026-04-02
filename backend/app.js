const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/Test.js");
const productRoutes = require("./src/Routes/ProductRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Running");
});

module.exports = app;
