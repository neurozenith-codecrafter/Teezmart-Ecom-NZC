const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/userRoutes.js");
const productRoutes = require("./src/Routes/ProductRoutes");
const adminRoutes = require("./src/Routes/adminRoutes");
const authRoutes = require("./src/Routes/authRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test", require("./src/Routes/TestRoutes"));
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/profile", userRoutes);

app.get("/", (req, res) => {
  res.send("Running");
});

module.exports = app;
