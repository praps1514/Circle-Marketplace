const Product = require("../models/Product");


// Create Product
const createProduct = async (req, res) => {
    try {

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// Get All Products (or Filtered by Seller)
const getProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.sellerEmail) {
            filter.sellerEmail = req.query.sellerEmail;
        }

        const products = await Product.find(filter)
            .populate("category")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Get Products By Category

const getProductsByCategory = async (req, res) => {

    try {

        const products = await Product.find({
            category: req.params.id
        })
            .populate("category");


        res.json({
            success: true,
            data: products
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, data: product, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductsByCategory,
    deleteProduct
};