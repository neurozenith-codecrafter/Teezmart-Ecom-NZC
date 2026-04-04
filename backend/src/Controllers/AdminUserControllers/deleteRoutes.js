const User = require("../../Models/UserSchema");

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent self deletion
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Prevent deleting another devAdmin
    if (user.role === "devAdmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete another devAdmin",
      });
    }

    // Already deleted
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User already deactivated",
      });
    }

    // Soft delete
    user.isActive = false;
    user.deletedAt = new Date(); // optional but useful
    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });

    // Frontend sample request:
      // DELETE /api/admin/users/65f123abc456def789012345
      // Authorization: Bearer <devAdmin_token>

  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};