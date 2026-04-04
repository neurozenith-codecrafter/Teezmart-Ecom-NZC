const { OAuth2Client } = require("google-auth-library");
const User = require("../Models/UserSchema");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Load roles from .env
const admins = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim())
  : [];

const devAdmins = process.env.DEV_ADMIN_EMAILS
  ? process.env.DEV_ADMIN_EMAILS.split(",").map((e) => e.trim())
  : [];

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { sub, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    // ✅ Determine role dynamically
    let role = "user";

    if (email && devAdmins.includes(email)) {
      role = "devAdmin";
    } else if (email && admins.includes(email)) {
      role = "admin";
    }

    let user = await User.findOne({ email });

    if (!user) {
      // ✅ New user
      user = await User.create({
        googleId: sub,
        email,
        name,
        avatar: picture,
        role,
        lastLogin: new Date(),
      });
    } else {
      // ✅ Existing user
      user.lastLogin = new Date();

      // 🔥 CRITICAL FIX → update role if changed
      if (user.role !== role) {
        user.role = role;
      }

      await user.save();
    }

    // ✅ Include role in JWT (optional but powerful)
    const appToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };

    res.status(200).json({
      token: appToken,
      user: safeUser,
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
};