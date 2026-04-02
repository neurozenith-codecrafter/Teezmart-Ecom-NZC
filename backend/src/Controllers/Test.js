const User = require("../Models/UserSchema");

const TestController = async (req, res) => {

  try {

    // Extracts the input fields from the request body
    const { name, email, phone, password } = req.body;

    // Validates the input fields
    if (!name || !email || !phone || !password) return res.status(400).json({ success: false, message: "All fields are required" });

    // Store only after validation success
    else User.create({ name, email, phone, password });  
    
    // Respond with success message and the stored data
    res.status(200).json({ success: true, message: "Test successful", data: { name, email, phone, password } });

  } catch (error) {

    // Handle any unexpected errors
    res.status(500).json({ success: false, message: "Test failed", error: error.message });

  }
}

module.exports = {
  TestController
}