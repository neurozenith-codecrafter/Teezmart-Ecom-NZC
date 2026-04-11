const userService = require("../Services/userServices");

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

const updateUserProfile = async (req, res) => {
  try {
    const safeUser = await userService.updateUserProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: safeUser,
      user: safeUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use",
        data: null,
      });
    }

    const statusCode =
      error.message === "User not found"
        ? 404
        : error.message === "Account is deactivated"
          ? 403
          : error.message === "Addresses must be an array" ||
              error.message === "You can add up to 5 addresses only" ||
              error.message === "Only one address can be default"
            ? 400
            : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update profile",
      data: null,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
