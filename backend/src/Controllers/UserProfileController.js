const userService = require("../Services/userServices");
const {
  ADDRESS_ROUTE_MESSAGE,
  PHONE_ERROR_MESSAGE,
} = require("../Utils/validation");

const resolveUserProfileErrorStatus = (error) => {
  if (error.code === 11000) {
    return 400;
  }

  const badRequestMessages = new Set([
    "Invalid user ID",
    "Addresses must be an array",
    "Addresses are required",
    "You can add up to 5 addresses only",
    "Only one address can be default",
    "Only name, phone and avatar can be updated in profile",
    "Name must be at least 2 characters long",
    "Name must be a string",
    "Name cannot exceed 50 characters",
    "Avatar must be a string",
    "Avatar cannot exceed 500 characters",
    "Street is required",
    "City is required",
    "State is required",
    "Pincode is required",
    "Country is required",
    "Pincode must be a valid 6-digit Indian postal code",
    "Pincode must be 3 to 10 characters and contain only letters, numbers, spaces or hyphens",
    ADDRESS_ROUTE_MESSAGE,
    PHONE_ERROR_MESSAGE,
  ]);

  if (
    badRequestMessages.has(error.message) ||
    /^Address at index \d+ must be an object$/.test(error.message) ||
    / must be a string$/.test(error.message) ||
    / cannot exceed \d+ characters$/.test(error.message)
  ) {
    return 400;
  }

  if (error.message === "User not found") {
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
      user: safeUser,
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
