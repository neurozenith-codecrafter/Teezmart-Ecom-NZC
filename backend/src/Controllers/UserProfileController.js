const userService = require("../Services/userServices");
const {
  ADDRESS_ROUTE_MESSAGE,
  isAddressValidationErrorMessage,
} = require("../Utils/validation");

const resolveUserProfileErrorStatus = (error) => {
  if (error.code === 11000) {
    return 400;
  }

  if (
    error.message === "Invalid user ID" ||
    error.message === "Only name, phone and avatar can be updated in profile" ||
    error.message === "Name must be at least 2 characters long" ||
    error.message === ADDRESS_ROUTE_MESSAGE ||
    isAddressValidationErrorMessage(error.message)
  ) {
    return 400;
  }

  if (error.message === "User not found") {
    return 404;
  }

  if (error.message === "Address not found") {
    return 404;
  }

  if (error.message === "Account is deactivated") {
    return 403;
  }

  if (error.message === "Not authorized" || error.message === "Unauthorized") {
    return 403;
  }

  return 500;
};

const getUserProfile = async (req, res) => {
  try {
    const safeUser = await userService.getUserProfile(req.user._id);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    const statusCode =
      error.message === "User not found"
        ? 404
        : error.message === "Account is deactivated"
          ? 403
          : 500;

    return res.status(statusCode).json({
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

    const statusCode = resolveUserProfileErrorStatus(error);

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update profile",
      data: null,
    });
  }
};

const updateUserAddresses = async (req, res) => {
  try {
    const safeUser = await userService.updateUserAddresses(
      req.user,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Addresses updated successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("Update Address Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use",
        data: null,
      });
    }

    const statusCode = resolveUserProfileErrorStatus(error);

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update addresses",
      data: null,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserAddresses,
};
