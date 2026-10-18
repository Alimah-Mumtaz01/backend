const reportService = require("../services/reportService");

const getSalesReport = async (req, res) => {
    try {
        const data = await reportService.getSalesReport(req.query);
        return res.status(200).json({
            success: true,
            message: "Laporan penjualan berhasil diambil",
            data
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil laporan penjualan"
        });
    }
};

const getOrdersReport = async (req, res) => {
    try {
        const data = await reportService.getOrdersReport(req.query);
        return res.status(200).json({
            success: true,
            message: "Laporan pesanan berhasil diambil",
            data
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil laporan pesanan"
        });
    }
};

const getProductsReport = async (req, res) => {
    try {
        const data = await reportService.getProductsReport(req.query);
        return res.status(200).json({
            success: true,
            message: "Laporan produk berhasil diambil",
            data
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil laporan produk"
        });
    }
};

const getVariantsReport = async (req, res) => {
    try {
        const data = await reportService.getVariantsReport(req.query);
        return res.status(200).json({
            success: true,
            message: "Laporan varian berhasil diambil",
            data
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil laporan varian"
        });
    }
};

module.exports = {
    getSalesReport,
    getOrdersReport,
    getProductsReport,
    getVariantsReport
};