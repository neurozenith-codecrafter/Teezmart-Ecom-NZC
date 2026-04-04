const User = require("../../Models/UserSchema");
const deleteUserAccount = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already deactivated
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Account already deactivated",
      });
    }

    // Soft delete
    user.isActive = false;
    // Set deletedAt timestamp
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });

  } catch (error) {
    console.error("Delete Account Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
    });
  }
};

module.exports = {
  deleteUserAccount,
};  