const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/UserRoutes.js");
const productRoutes = require("./src/Routes/ProductRoutes");
const adminRoutes = require("./src/Routes/AdminRoutes/adminRoutes");
const authRoutes = require("./src/Routes/authRoutes.js");
const cartRoutes = require("./src/Routes/CartRoutes.js");
const orderRoutes = require("./src/Routes/OrderRoute.js");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://teezmart-ecom-52187ext5-neurozenith-codecrafters-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
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
