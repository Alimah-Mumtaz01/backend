const varianService = require('../services/varianService');

const getAllVarians = async (req, res) => {
    try {
        const varian = await varianService.getAllVarians();
        return res.status(200).json({
            success: true,
            message: "Data varian berhasil diambil",
            data: varian,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const getVarianById = async (req, res) => {
    try {
        const { id_varian } = req.params;
        const varian = await varianService.getVarianById(id_varian);
        return res.status(200).json({
            success: true,
            message: "Data varian berhasil diambil",
            data: varian,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const createVarian = async (req, res) => {
    try {
        const varian = await varianService.createVarian(req.body);
        return res.status(201).json({
            success: true,
            message: "Varian berhasil dibuat",
            data: varian,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const updateVarian = async (req, res) => {
    try {
        const { id_varian } = req.params;
        const varian = await varianService.updateVarian(id_varian, req.body);
        return res.status(200).json({
            success: true,
            message: "Varian berhasil diperbarui",
            data: varian,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const updateStock = async (req, res) => {
    try {
        const { id_varian } = req.params;
        const { stok } = req.body;
        const varian = await varianService.updateStock(id_varian, stok);
        return res.status(200).json({
            success: true,
            message: "Stok varian berhasil diperbarui",
            data: varian,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const deleteVarian = async (req, res) => {
    try {
        const { id_varian } = req.params;
        const varian = await varianService.deleteVarian(id_varian);
        return res.status(200).json({
            success: true,
            message: "Varian berhasil dihapus",
            data: varian,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

module.exports = {
    getAllVarians,
    getVarianById,
    createVarian,
    updateVarian,
    updateStock,
    deleteVarian
};