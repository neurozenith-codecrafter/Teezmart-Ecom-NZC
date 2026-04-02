const dns = require("dns");
const mongoose = require("mongoose");

// Helps some Windows / dual-stack setups resolve Atlas SRV records reliably
dns.setDefaultResultOrder("ipv4first");

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Add it to backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15_000,
    });
    console.log("DB connected");
  } catch (e) {
    console.error("MongoDB connection failed:", e.message);
    if (
      String(e.message).includes("querySrv") ||
      String(e.message).includes("ECONNREFUSED")
    ) {
      console.error(
        "Usually DNS or network: check internet/VPN/firewall, try DNS 8.8.8.8, " +
          "Atlas → Network Access (allow your IP or 0.0.0.0/0 for dev), and that the cluster is not paused."
      );
    }
    process.exit(1);
  }
};

module.exports = connectDb;
