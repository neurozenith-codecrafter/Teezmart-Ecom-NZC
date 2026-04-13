const userService = require("../../Services/userServices");
const {
  ADDRESS_ROUTE_MESSAGE,
  PHONE_ERROR_MESSAGE,
} = require("../../Utils/validation");

const resolveStatusCode = (error) => {
  if (error.code === 11000) {
    return 400;
  }

  if (error.message === "User not found") {
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
    error.message === PHONE_ERROR_MESSAGE ||
    error.message === "Addresses must be an array" ||
    error.message === "Addresses are required" ||
    error.message === "You can add up to 5 addresses only" ||
    error.message === "Only one address can be default" ||
    error.message === "Only name, phone and avatar can be updated in profile" ||
    /^Address at index \d+ must be an object$/.test(error.message) ||
    / is required$/.test(error.message) ||
    / must be a string$/.test(error.message) ||
    / cannot exceed \d+ characters$/.test(error.message) ||
    error.message === "Pincode must be a valid 6-digit Indian postal code" ||
    error.message ===
      "Pincode must be 3 to 10 characters and contain only letters, numbers, spaces or hyphens"
  ) {
    return 400;
  }

  return 500;
};


// const updateUserProfile = async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Account is deactivated",
//       });
//     }

//     const { name, phone, avatar, addresses } = req.body;

//     if (name !== undefined) user.name = name;
//     if (phone !== undefined) user.phone = phone;
//     if (avatar !== undefined) user.avatar = avatar;

//     // Validate addresses if provided
//     if (addresses !== undefined) {
//       if (!Array.isArray(addresses)) {
//         return res.status(400).json({
//           success: false,
//           message: "Addresses must be an array",
//         });
//       }

//       if (addresses.length > 5) {
//         return res.status(400).json({
//           success: false,
//           message: "You can add up to 5 addresses only",
//         });
//       }

//       const defaultCount = addresses.filter(addr => addr.isDefault).length;

//       if (defaultCount > 1) {
//         return res.status(400).json({
//           success: false,
//           message: "Only one address can be default",
//         });
//       }

//       if (defaultCount === 0 && addresses.length > 0) {
//         addresses[0].isDefault = true;
//       }

//       user.addresses = addresses; // 🔥 critical line
//     }
//     await user.save();

//     const safeUser = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       avatar: user.avatar,
//       role: user.role,
//       addresses: user.addresses,
//       createdAt: user.createdAt,
//     };

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: safeUser,
//     });

//   } catch (error) {
//     console.error("Update Profile Error:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone number already in use",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Failed to update profile",
//     });
//   }
// };

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

    res.status(resolveStatusCode(error)).json({
      success: false,
      message: error.message || "Failed to update addresses",
      data: null,
    });
  }
};

module.exports = {
  updateUserProfile: updateUserProfileShared,
  updateUserAddresses,
};
