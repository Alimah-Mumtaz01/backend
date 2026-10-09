const paymentService = require("../services/paymentService");

const uploadPayment = async (req, res) => {
    try {
        const id_user = req.user.id_user;
        const {id_order} = req.params;
        const {metode_pembayaran} = req.body;

        if (
            !["transfer_bank", "e-wallet"].includes(
                metode_pembayaran
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Metode pembayaran harus Transfer Bank atau E-Wallet",
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Bukti pembayaran wajib diupload",
            });
        }
        const payment = await paymentService.uploadPayment(
            id_user,
            id_order,
            metode_pembayaran,
            req.file.filename
        );
        return res.status(201).json({
            success: true,
            message: "Bukti pembayaran berhasil diupload dan sedang diperiksa admin",
            data: payment,
        });
    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server",
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const id_admin = req.user.id_user;
        const {id_order} = req.params;
        const {status_payment, catatan_verifikasi} = req.body;
        const result = await paymentService.verifyPayment(
            id_admin,
            id_order,
            status_payment,
            catatan_verifikasi
        );
        return res.status(200).json({
            success: true,
            message: status_payment === "verified"
            ? "Pembayaran berhasil diverifikasi"
            : "Pembayaran berhasil ditolak",
            data : result
        });
    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Terjadi kesalahan pada server"
        });
    }
};

module.exports = {
    uploadPayment,
    verifyPayment
};