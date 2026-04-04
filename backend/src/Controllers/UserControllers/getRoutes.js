const User = require("../../Models/UserSchema");

getUserProfile = (req, res) => {
  try {
    const user = req.user;

    // Edge case: user missing
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Edge case: blocked user
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Safe response
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      user: safeUser,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

module.exports = {
  getUserProfile,
};  