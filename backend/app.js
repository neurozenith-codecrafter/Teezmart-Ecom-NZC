const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/UserRoutes.js");
const productRoutes = require("./src/Routes/ProductRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test", require("./src/Routes/TestRoutes"));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Running");
});

module.exports = app;
