const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect();
  } catch (e) {
    console.log("Error:", e);
    process.exit(1);
  }
};

connectDb();
