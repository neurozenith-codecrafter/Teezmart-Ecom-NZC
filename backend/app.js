const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/UserRoutes.js");
const productRoutes = require("./src/Routes/ProductRoutes");
const adminRoutes = require("./src/Routes/AdminRoutes/adminRoutes");
const authRoutes = require("./src/Routes/authRoutes.js");
const cartRoutes = require("./src/Routes/CartRoutes.js");
const orderRoutes = require("./src/Routes/OrderRoute.js");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://teezmart-ecom-dnpxr7rzt-neurozenith-codecrafters-projects.vercel.app"
  ],
  credentials: true
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json());

app.use("/api/auth", authRoutes);

// User routes
app.use("/api/users", userRoutes);

// Product routes
app.use("/api/products", productRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

// Default route to check if server is running
app.get("/", (req, res) => {
  res.send("Running");
});

module.exports = app;
