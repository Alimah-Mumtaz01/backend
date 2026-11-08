const productService = require("../services/productService");
const fs = require("fs");
const path = require("path");

const removeProductImage = async (imagePath) => {
    if (!imagePath) return;
    const filename = path.basename(imagePath);
    if (!filename.startsWith("product-")) return;
    const filePath = path.join(
        __dirname,
        "../uploads/products",
        filename
    );
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Gagal menghapus gambar:", error);
        }
    }
};

const getImagePath = (file) => {
    return file
        ? `uploads/products/${file.filename}`
        : undefined;
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).json({
            success: true,
            message: "Data product berhasil diambil",
            data: products
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(
            req.params.id_product
        );
        return res.status(200).json({
            success: true,
            message: "Data product berhasil diambil",
            data: product
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server"
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            gambar: getImagePath(req.file) || req.body.gambar || null
        };
        const product = await productService.createProduct(productData);
        return res.status(201).json({
            success: true,
            message: "Data product berhasil ditambahkan",
            data: product
        });
    } catch (error) {
        if (req.file) {
            await removeProductImage(getImagePath(req.file));
        }
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server"
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const oldProduct = await productService.getProductById(
            req.params.id_product
        );
        const productData = {
            ...req.body
        };
        if (req.file) {
            productData.gambar = getImagePath(req.file);
        }
        const product = await productService.updateProduct(
            req.params.id_product,
            productData
        );
        if (req.file && oldProduct.gambar) {
            await removeProductImage(oldProduct.gambar);
        }
        return res.status(200).json({
            success: true,
            message: "Data product berhasil diperbarui",
            data: product
        });
    } catch (error) {
        if (req.file) {
            await removeProductImage(getImagePath(req.file));
        }
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server"
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(
            req.params.id_product
        );
        await productService.deleteProduct(req.params.id_product);
        if (product.gambar) {
            await removeProductImage(product.gambar);
        }
        return res.status(200).json({
            success: true,
            message: "Product berhasil dihapus",
            data: product
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server"
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};