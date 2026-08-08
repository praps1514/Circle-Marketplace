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



// Get All Products
const getProducts = async (req, res) => {
    try {

        const products = await Product.find()
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



module.exports = {
    createProduct,
    getProducts,
    getProductsByCategory
};