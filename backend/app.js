const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Global Cache-Control middleware to prevent Vercel from serving stale API data
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// Support both /api/categories and /categories for local & Vercel serverless functions
app.use(["/api/categories", "/categories"], categoryRoutes);
app.use(["/api/products", "/products"], productRoutes);

app.get(["/", "/api"], (req, res) => {
  res.json({
    success: true,
    message: "Circle Marketplace API is running 🚀",
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Vercel Debug 404: The route ${req.method} ${req.url} was not found in Express.`,
    originalUrl: req.originalUrl,
    path: req.path
  });
});

module.exports = app;