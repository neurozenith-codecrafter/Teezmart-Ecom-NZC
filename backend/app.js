const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/UserRoutes.js");
const productRoutes = require("./src/Routes/ProductRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test route to verify server is working
app.use("/api/test", require("./src/Routes/TestRoutes"));

// User routes
app.use("/api/users", userRoutes);

// Product routes
app.use("/api/products", productRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Running");
});

module.exports = app;
