const mongoose = require("mongoose");

let isConnected = false;

// Fallback MongoDB connection string if process.env.MONGO_URI is omitted in Vercel settings
const FALLBACK_MONGO_URI = "mongodb+srv://prasanithak_db:MongoDB123@cluster0.g8nvse7.mongodb.net/circle_marketplace?retryWrites=true&w=majority";

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
    const connUri = process.env.MONGO_URI || FALLBACK_MONGO_URI;
    const conn = await mongoose.connect(connUri, {
      bufferCommands: false,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    // Do not call process.exit(1) in serverless execution environments
    throw error;
  }
};

module.exports = connectDB;
