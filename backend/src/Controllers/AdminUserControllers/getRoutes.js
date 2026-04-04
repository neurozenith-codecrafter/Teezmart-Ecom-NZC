const User = require("../../Models/UserSchema");

exports.getAllUsers = async (req, res) => {
  try {
    // Query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch users
    const users = await User.find()
      .select("-__v -password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Total count
    const totalUsers = await User.countDocuments();

    // Pagination info
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalUsers,
      totalPages,
      count: users.length,
      users,
    });

    // Frontend sample request:
      // GET /api/admin/users?page=2&limit=5
      // Authorization: Bearer <admin_token>

  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Fetch user (exclude sensitive fields)
    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Optional: prevent admin from viewing devAdmin
    if (req.user.role === "admin" && user.role === "devAdmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

    // Frontend sample request:
      // GET /api/admin/users/60d0fe4f5311236168a109ca
      // Authorization: Bearer <admin-token>

  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};