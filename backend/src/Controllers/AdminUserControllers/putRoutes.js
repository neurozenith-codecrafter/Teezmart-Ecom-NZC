const User = require("../../Models/UserSchema");

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate Mongo ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Validate role input
    const allowedRoles = ["user", "admin", "devAdmin"];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role provided",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent self role change (important)
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    // Prevent changing another devAdmin (optional but recommended)
    if (user.role === "devAdmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot modify another devAdmin",
      });
    }

    // Update role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });

    // Frontend sample request:
    // PUT /api/admin/users/65f123abc456def789012345/role
    //   Authorization: Bearer <devAdmin_token>
    //   Content-Type: application/json

    //   {
    //     "role": "admin"
    //   }

  } catch (error) {
    console.error("Update User Role Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};