const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (e) {
    console.log("Error:", e.message);
    process.exit(1);
  }
};

module.exports = connectDb;
