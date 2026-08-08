const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Support both /api/categories and /categories for local & Vercel serverless functions
app.use(["/api/categories", "/categories"], categoryRoutes);
app.use(["/api/products", "/products"], productRoutes);

app.get(["/", "/api"], (req, res) => {
  res.json({
    success: true,
    message: "Circle Marketplace API is running 🚀",
  });
});

module.exports = app;