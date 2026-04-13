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
exports.getMe = (req, res) => {
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: req.user,
  });
};
