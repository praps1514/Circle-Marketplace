require("dotenv").config();
const app = require("../backend/app");
const connectDB = require("../backend/config/db");

module.exports = async (req, res) => {
  // TEST: return a 200 OK directly to verify this file is executed by Vercel
  if (req.method === 'POST') {
    return res.status(200).json({ success: true, message: "Vercel hit api/products.js successfully" });
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
