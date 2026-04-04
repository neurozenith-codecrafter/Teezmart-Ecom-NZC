const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/userRoutes.js");
const productRoutes = require("./src/Routes/productRoutes");
const adminRoutes = require("./src/Routes/AdminRoutes/adminRoutes");
const authRoutes = require("./src/Routes/authRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// User routes
app.use("/api/users", userRoutes);

// Product routes
app.use("/api/products", productRoutes);

app.use("/api/admin", adminRoutes);

// Default route to check if server is running
app.get("/", (req, res) => {
  res.send("Running");
});

module.exports = app;
