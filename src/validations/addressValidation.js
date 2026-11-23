const Joi = require("joi");

const addressSchema = Joi.object({
    nama_penerima: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Nama penerima harus diisi",
            "string.min": "Nama penerima minimal 3 karakter",
            "string.max": "Nama penerima maksimal 100 karakter",
            "any.required": "Nama penerima harus diisi",
        }),

    no_hp: Joi.string()
        .trim()
        .pattern(/^[0-9+]{10,20}$/)
        .required()
        .messages({
            "string.empty": "Nomor HP harus diisi",
            "string.pattern.base": "Format nomor HP tidak valid",
            "any.required": "Nomor HP harus diisi",
        }),

    alamat: Joi.string()
        .trim()
        .min(10)
        .required()
        .messages({
            "string.empty": "Alamat harus diisi",
            "string.min": "Alamat minimal 10 karakter",
            "any.required": "Alamat harus diisi",
        }),

    latitude: Joi.number()
        .min(-90)
        .max(90)
        .allow(null)
        .optional(),

    longitude: Joi.number()
        .min(-180)
        .max(180)
        .allow(null)
        .optional(),

    catatan: Joi.string()
        .allow("", null)
        .optional(),
});

module.exports = {
    addressSchema,
};