const Joi = require("joi");

const createProductSchema = Joi.object({
    nama_product: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
        "string.empty": "Nama product wajib diisi",
        "string.min": "Nama product minimal 3 karakter",
        "string.max": "Nama product maksimal 100 karakter",
        "any.required": "Nama product wajib diisi",
    }),

    jumlah_isi: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
        "number.base": "Jumlah isi harus berupa angka",
        "number.integer": "Jumlah isi harus berupa bilangan bulat",
        "number.min": "Jumlah isi minimal 1",
        "any.required": "Jumlah isi wajib diisi",
    }),

    harga: Joi.number()
    .min(0)
    .required()
    .messages({
        "number.base": "Harga harus berupa angka",
        "number.min": "Harga tidak boleh kurang dari 0",
        "any.required": "Harga wajib diisi",
    }),

    deskripsi: Joi.string()
    .allow("")
    .max(1000)
    .messages({
        "string.max": "Deskripsi maksimal 1000 karakter",
    }),

    gambar: Joi.string()
    .allow("")
    .max(255)
    .messages({
        "string.max": "Nama gambar maksimal 255 karakter",
    }),

    status: Joi.string()
    .valid("aktif", "nonaktif")
    .default("aktif")
    .messages({
        "any.only": "Status hanya boleh aktif atau nonaktif"
    })
});

const updateProductSchema = Joi.object({
    nama_product: Joi.string()
    .min(3)
    .max(100)
    .messages({
        "string.min": "Nama product minimal 3 karakter",
        "string.max": "Nama product maksimal 100 karakter"
    }),

    jumlah_isi: Joi.number()
    .integer()
    .min(1)
    .messages({
        "number.base": "Jumlah isi harus berupa angka",
        "number.integer": "Jumlah isi harus berupa bilangan bulat",
        "number.min": "Jumlah isi minimal 1"
    }),

    harga: Joi.number()
    .min(0)
    .messages({
        "number.base": "Harga harus berupa angka",
        "number.min": "Harga tidak boleh kurang dari 0"
    }),

    deskripsi: Joi.string()
    .allow("")
    .max(1000)
    .messages({
        "string.max": "Deskripsi maksimal 1000 karakter",
    }),

    gambar: Joi.string()
    .allow("")
    .max(255)
    .messages({
        "string.max": "Nama gambar maksimal 255 karakter",
    }),

    status: Joi.string()
    .valid("aktif", "nonaktif")
    .default("aktif")
    .messages({
        "any.only": "Status hanya boleh aktif atau nonaktif"
    })
}).min(1);

module.exports = {
    createProductSchema,
    updateProductSchema
};