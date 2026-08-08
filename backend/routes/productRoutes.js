const express = require("express");

const router = express.Router();


const {
    createProduct,
    getProducts,
    getProductsByCategory,
    deleteProduct
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
// Delete Product
router.delete(
    "/:id",
    deleteProduct
);

module.exports = router;