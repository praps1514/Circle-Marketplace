require("dotenv").config();
const app = require("../backend/app");
const connectDB = require("../backend/config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel DB Connection Error:", error);
    res.status(500).json({
      success: false,
      message: "Serverless Database Connection Error: " + error.message
    });
  }
};

