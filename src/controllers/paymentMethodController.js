const paymentService = require("../services/paymentService");

/**
 * Menampilkan seluruh metode pembayaran untuk admin.
 */
const getAllPaymentMethods = async (req, res) => {
    try {
        const data = await paymentService.getAllPaymentMethods();

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil seluruh metode pembayaran",
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil metode pembayaran",
        });
    }
};

/**
 * Menampilkan metode pembayaran aktif untuk customer.
 */
const getActivePaymentMethods = async (req, res) => {
    try {
        const data = await paymentService.getActivePaymentMethods();

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil metode pembayaran aktif",
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal mengambil metode pembayaran aktif",
        });
    }
};

/**
 * Menambahkan metode pembayaran baru.
 */
const createPaymentMethod = async (req, res) => {
    try {
        const data = await paymentService.createPaymentMethod(req.body);

        return res.status(201).json({
            success: true,
            message: "Metode pembayaran berhasil ditambahkan",
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal menambahkan metode pembayaran",
        });
    }
};

/**
 * Memperbarui data metode pembayaran.
 */
const updatePaymentMethod = async (req, res) => {
    try {
        const { id_metode_pembayaran } = req.params;

        const data = await paymentService.updatePaymentMethod(
            id_metode_pembayaran,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Metode pembayaran berhasil diperbarui",
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal memperbarui metode pembayaran",
        });
    }
};

/**
 * Mengubah status aktif/nonaktif metode pembayaran.
 */
const updatePaymentMethodStatus = async (req, res) => {
    try {
        const { id_metode_pembayaran } = req.params;
        const { status } = req.body;

        const data = await paymentService.updatePaymentMethodStatus(
            id_metode_pembayaran,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Status metode pembayaran berhasil diperbarui",
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal memperbarui status metode pembayaran",
        });
    }
};

/**
 * Menghapus metode pembayaran.
 * Jika sudah pernah digunakan, service akan menonaktifkannya.
 */
const deletePaymentMethod = async (req, res) => {
    try {
        const { id_metode_pembayaran } = req.params;

        const result = await paymentService.deletePaymentMethod(
            id_metode_pembayaran
        );

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Gagal menghapus metode pembayaran",
        });
    }
};

module.exports = {
    getAllPaymentMethods,
    getActivePaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    updatePaymentMethodStatus,
    deletePaymentMethod,
};