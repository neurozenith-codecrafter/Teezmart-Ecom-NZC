const User = require("../../Models/UserSchema");


const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const { name, phone, avatar, addresses } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    // Validate addresses if provided
    if (addresses !== undefined) {
      if (!Array.isArray(addresses)) {
        return res.status(400).json({
          success: false,
          message: "Addresses must be an array",
        });
      }

      if (addresses.length > 5) {
        return res.status(400).json({
          success: false,
          message: "You can add up to 5 addresses only",
        });
      }

      const defaultCount = addresses.filter(addr => addr.isDefault).length;

      if (defaultCount > 1) {
        return res.status(400).json({
          success: false,
          message: "Only one address can be default",
        });
      }

      if (defaultCount === 0 && addresses.length > 0) {
        addresses[0].isDefault = true;
      }

      user.addresses = addresses; // 🔥 critical line
    }
    await user.save();

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
      message: "Profile updated successfully",
      user: safeUser,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  updateUserProfile,
};
