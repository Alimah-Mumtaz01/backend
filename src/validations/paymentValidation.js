const Joi = require("joi");

/**
 * Validasi upload bukti pembayaran.
 */
const uploadPaymentSchema = Joi.object({
    id_metode_pembayaran: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "ID metode pembayaran harus berupa angka",
            "number.integer": "ID metode pembayaran harus berupa bilangan bulat",
            "number.positive": "ID metode pembayaran harus lebih dari 0",
            "any.required": "Metode pembayaran harus dipilih",
        }),
});

/**
 * Validasi verifikasi pembayaran oleh admin.
 */
const verifyPaymentSchema = Joi.object({
    status_payment: Joi.string()
        .valid("verified", "rejected")
        .required()
        .messages({
            "any.only": "Status pembayaran tidak valid",
            "any.required": "Status pembayaran harus diisi",
            "string.empty": "Status pembayaran harus diisi",
        }),

    catatan_verifikasi: Joi.when("status_payment", {
        is: "rejected",

        then: Joi.string()
            .trim()
            .min(1)
            .required()
            .messages({
                "string.empty": "Alasan penolakan pembayaran harus diisi",
                "any.required": "Alasan penolakan pembayaran harus diisi",
            }),

        otherwise: Joi.string().allow("", null),
    }),
});

/**
 * Validasi data metode pembayaran.
 */
const paymentMethodSchema = Joi.object({
    jenis_metode: Joi.string()
        .valid("transfer_bank", "e-wallet")
        .required()
        .messages({
            "any.only": "Jenis metode harus Transfer Bank atau E-Wallet",
            "any.required": "Jenis metode pembayaran harus dipilih",
            "string.empty": "Jenis metode pembayaran harus dipilih",
        }),

    nama_bank: Joi.when("jenis_metode", {
        is: "transfer_bank",

        then: Joi.string()
            .trim()
            .min(1)
            .max(100)
            .required()
            .messages({
                "string.empty": "Nama bank harus diisi",
                "any.required": "Nama bank harus diisi",
                "string.max": "Nama bank maksimal 100 karakter",
            }),

        otherwise: Joi.string()
            .allow("", null)
            .default(null),
    }),

    jenis_e_wallet: Joi.when("jenis_metode", {
        is: "e-wallet",

        then: Joi.string()
            .trim()
            .min(1)
            .max(100)
            .required()
            .messages({
                "string.empty": "Jenis e-wallet harus diisi",
                "any.required": "Jenis e-wallet harus diisi",
                "string.max": "Jenis e-wallet maksimal 100 karakter",
            }),

        otherwise: Joi.string()
            .allow("", null)
            .default(null),
    }),

    nomor_rekening: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
            "string.empty": "Nomor rekening atau akun harus diisi",
            "any.required": "Nomor rekening atau akun harus diisi",
            "string.max": "Nomor rekening maksimal 50 karakter",
        }),

    username: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            "string.empty": "Nama pemilik atau username harus diisi",
            "any.required": "Nama pemilik atau username harus diisi",
            "string.max": "Nama pemilik atau username maksimal 100 karakter",
        }),
});

const createPaymentMethodSchema = paymentMethodSchema;

const updatePaymentMethodSchema = paymentMethodSchema;

/**
 * Validasi perubahan status metode pembayaran.
 */
const updatePaymentMethodStatusSchema = Joi.object({
    status: Joi.string()
        .valid("aktif", "nonaktif")
        .required()
        .messages({
            "any.only": "Status hanya boleh aktif atau nonaktif",
            "any.required": "Status metode pembayaran harus diisi",
            "string.empty": "Status metode pembayaran harus diisi",
        }),
});

module.exports = {
    uploadPaymentSchema,
    verifyPaymentSchema,
    createPaymentMethodSchema,
    updatePaymentMethodSchema,
    updatePaymentMethodStatusSchema,
};