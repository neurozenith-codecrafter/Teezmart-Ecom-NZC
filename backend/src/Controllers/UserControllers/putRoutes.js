const userService = require("../../Services/userServices");
const {
  ADDRESS_ROUTE_MESSAGE,
  isAddressValidationErrorMessage,
} = require("../../Utils/validation");

const resolveStatusCode = (error) => {
  if (error.code === 11000) {
    return 400;
  }

  if (error.message === "User not found") {
    return 404;
  }

  if (error.message === "Address not found") {
    return 404;
  }

  if (
    error.message === "Account is deactivated" ||
    error.message === "Unauthorized" ||
    error.message === "Not authorized"
  ) {
    return 403;
  }

  if (
    error.message === ADDRESS_ROUTE_MESSAGE ||
    error.message === "Only name, phone and avatar can be updated in profile" ||
    isAddressValidationErrorMessage(error.message)
  ) {
    return 400;
  }

  return 500;
};

const updateUserProfileShared = async (req, res) => {
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

    res.status(resolveStatusCode(error)).json({
      success: false,
      message: error.message || "Failed to update profile",
      data: null,
    });
  }
};

module.exports = {
  updateUserProfile: updateUserProfileShared,
};
