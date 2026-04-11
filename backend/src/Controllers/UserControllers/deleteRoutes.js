const User = require("../../Models/UserSchema");
const deleteUserAccount = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Already deactivated
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Account already deactivated",
        data: null,
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
      data: null,
    });

  } catch (error) {
    console.error("Delete Account Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
      data: null,
    });
  }
};

module.exports = {
  deleteUserAccount,
};  
