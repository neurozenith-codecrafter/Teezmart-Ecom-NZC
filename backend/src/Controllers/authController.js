const { OAuth2Client } = require("google-auth-library");
const User = require("../Models/UserSchema");
const jwt = require("jsonwebtoken");
const { buildSafeUser } = require("../Services/userServices");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Load roles from .env
const admins = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
  : [];

const devAdmins = process.env.DEV_ADMIN_EMAILS
  ? process.env.DEV_ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
  : [];

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
        data: null,
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
        data: null,
      });
    }

    const { sub, email, name, picture } = payload;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Google account has no email",
        data: null,
      });
    }

    // ✅ Determine role
    let role = "user";
    if (devAdmins.includes(normalizedEmail)) {
      role = "devAdmin";
    } else if (admins.includes(normalizedEmail)) {
      role = "admin";
    }

    // 🔥 SINGLE ATOMIC OPERATION
    let user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          googleId: sub,
          role,
        },
        $currentDate: {
          lastLogin: true, // ✅ better than new Date()
        },
        $setOnInsert: {
          email: normalizedEmail,
          name,
          avatar: picture,
          addresses: [], // only for new users
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    // ✅ JWT
    const appToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const safeUser = buildSafeUser(user);

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      token: appToken,
      data: safeUser,
      user: safeUser,
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);

    res.status(500).json({
      success: false,
      message: "Authentication failed",
      data: null,
    });
  }
};
