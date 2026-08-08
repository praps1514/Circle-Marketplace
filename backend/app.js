const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");


const app = express();


app.use(cors());
app.use(express.json());


app.use(
  "/api/categories",
  categoryRoutes
);


app.use(
  "/api/products",
  productRoutes
);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Circle Marketplace API is running 🚀",
  });
});


module.exports = app;