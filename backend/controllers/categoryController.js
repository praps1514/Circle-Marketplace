const Category = require("../models/Category");

// Helper to verify admin authorization
const checkAdminRole = (req, res) => {
    const userRole = req.headers["x-user-role"] || req.headers["x-role"] || req.query.role;
    if (userRole !== "admin") {
        res.status(403).json({
            success: false,
            message: "Access denied. Admin role required to create, update, or delete categories."
        });
        return false;
    }
    return true;
};

// Create Category (POST /api/categories - Admin Protected)
const createCategory = async (req, res) => {
    if (!checkAdminRole(req, res)) return;

    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Categories (GET /api/categories - Public for Sellers & Admins)
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Category (PUT /api/categories/:id - Admin Protected)
const updateCategory = async (req, res) => {
    if (!checkAdminRole(req, res)) return;

    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                fields: req.body.fields
            },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Category (DELETE /api/categories/:id - Admin Protected)
const deleteCategory = async (req, res) => {
    if (!checkAdminRole(req, res)) return;

    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};