require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");

const clearProducts = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    const countBefore = await Product.countDocuments();
    console.log(`Found ${countBefore} products in MongoDB Atlas.`);

    const res = await Product.deleteMany({});
    console.log(`✅ Deleted ${res.deletedCount} products from MongoDB Atlas.`);
  } catch (error) {
    console.error("❌ Failed to clear products:", error.message);
  } finally {
    process.exit(0);
  }
};

clearProducts();
