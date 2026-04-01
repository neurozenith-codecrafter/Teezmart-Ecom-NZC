const User = require("../../Models/UserSchema");

const TestController = async (req, res) => {
  try {
    const name = req.body.name;
    const password = req.body.password;
    const phone = req.body.phone;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    await User.create({ name, password, phone });

    return res.status(200).json({ message: `Hello, ${name}!` });

  } catch (error) {
    console.error("Error in TestController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { TestController };