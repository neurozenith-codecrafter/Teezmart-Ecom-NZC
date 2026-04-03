const { OAuth2Client } = require("google-auth-library");
const User = require("../Models/UserSchema");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const admins = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",")
  : [];

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email, name, picture } = payload;

    //check for admin
    let role = "user";
    if (admins.includes(email)) role = "admin";

    //Find or Create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        avatar: picture,
        role,
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      user.role = role; // keeps role synced with env
      await user.save();
    }
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token: appToken, user });
  } catch (err) {
    res.status(500).json({ message: "Auth failed" });
  }
};
