const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
      data: null,
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-__v -password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
        data: null,
      });
    }

    req.user = user;
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        data: null,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
      data: null,
    });
  }
};

// Role-based access control middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        data: null,
      });
    }
    next();
  };
};

// Optional helper
const Cart = require("../Models/CartSchema");
const Wishlist = require("../Models/WishlistSchema");

exports.getMe = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch in parallel (important for performance)
    const [cart, wishlist] = await Promise.all([
      Cart.findOne({ user: userId }),
      Wishlist.findOne({ user: userId }),
    ]);

    const cartCount = cart?.totalQuantity || 0;
    const wishlistCount = wishlist?.items?.length || 0;

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        ...req.user.toObject(), // important if it's a mongoose doc
        cartCount,
        wishlistCount,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
