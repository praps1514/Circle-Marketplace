const express = require("express");

const router = express.Router();


const {
    createProduct,
    getProducts,
    getProductsByCategory
} = require("../controllers/productController");



// Create Product
router.post(
    "/",
    createProduct
);


// Get All Products
router.get(
    "/",
    getProducts
);


// Get Products By Category
router.get(
    "/category/:id",
    getProductsByCategory
);


module.exports = router;