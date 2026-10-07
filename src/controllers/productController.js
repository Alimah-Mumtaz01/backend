const productService = require("../services/productService");

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).json({
            success: true,
            message: "Data product berhasil diambil",
            data: products,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const {id_product} = req.params;
        const product = await productService.getProductById(id_product);
        return res.status(200).json({
            success: true,
            message: "Data product berhasil diambil",
            data: product,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        return res.status(201).json({
            success: true,
            message: "Data product berhasil ditambahkan",
            data: product,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {id_product} = req.params;
        const product = await productService.updateProduct(
            id_product,
            req.body
        );
        return res.status(200).json({
            success: true,
            message: "Data product berhasil diperbarui",
            data: product,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const {id_product} = req.params;
        const product = await productService.deleteProduct(id_product);
        return res.status(200).json({
            success: true,
            message: "Product berhasil dihapus",
            data: product,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};