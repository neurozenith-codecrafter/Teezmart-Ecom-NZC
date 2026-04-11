const userService = require("../../Services/userServices");

const getUserProfile = async (req, res) => {
  try {
    const safeUser = await userService.getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: safeUser,
      user: safeUser,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    const statusCode =
      error.message === "User not found"
        ? 404
        : error.message === "Account is deactivated"
          ? 403
          : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch profile",
      data: null,
    });
  }
};

module.exports = {
  getUserProfile,
};  
