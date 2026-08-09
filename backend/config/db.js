const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  // Set custom DNS resolvers safely only on Windows development platform
  if (process.platform === "win32") {
    try {
      const dns = require("dns");
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
      console.log("DNS setServers skipped:", e.message);
    }
  }

  try {
    const connUri = process.env.MONGO_URI;

    if (!connUri) {
      throw new Error("MONGO_URI environment variable is not configured");
    }

    const conn = await mongoose.connect(connUri, {
      bufferCommands: false,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;