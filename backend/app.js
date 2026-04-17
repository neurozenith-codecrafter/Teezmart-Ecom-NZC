const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/UserRoutes.js");
const productRoutes = require("./src/Routes/ProductRoutes");
const adminRoutes = require("./src/Routes/AdminRoutes/adminRoutes");
const authRoutes = require("./src/Routes/authRoutes.js");
const cartRoutes = require("./src/Routes/CartRoutes.js");
const orderRoutes = require("./src/Routes/OrderRoute.js");

const app = express();

// Allowed origins: localhost dev + any Vercel deployment for this project
const allowedOrigins = [
  "http://localhost:5173",
  /^https:\/\/teezmart-ecom.*\.vercel\.app$/,
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) =>
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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
