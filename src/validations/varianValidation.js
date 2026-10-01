const Joi = require("joi");

const createVarianSchema = Joi.object({
    nama_varian: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
        "string.empty": "Nama varian wajib diisi",
        "string.min": "Nama varian minimal 3 karakter",
        "string.max": "Nama varian maksimal 100 karakter",
        "any.required": "Nama varian wajib diisi",
    }),
    
    stok: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
        "number.base": "Stok harus berupa angka",
        "number.integer": "Stok harus berupa bilangan bulat",
        "number.min": "Stok tidak boleh kurang dari 0",
    }),

    status: Joi.string()
    .valid("aktif", "nonaktif")
    .default("aktif")
    .messages({
        "any.only": "Status hanya boleh aktif atau nonaktif"
    })
});

const updateVarianSchema = Joi.object({
    nama_varian: Joi.string()
    .min(3)
    .max(100)
    .messages({
        "string.min": "Nama varian minimal 3 karakter",
        "string.max": "Nama varian maksimal 100 karakter",
    }),

    stok: Joi.number()
    .integer()
    .min(0)
    .messages({
        "number.base": "Stok harus berupa angka",
        "number.integer": "Stok harus berupa bilangan bulat",
        "number.min": "Stok tidak boleh kurang dari 0",
    }),

    status: Joi.string()
    .valid("aktif", "nonaktif")
    .messages({
        "any.only": "Status hanya boleh aktif atau nonaktif"
    })
}).min(1);

const updateStockSchema = Joi.object({
    stok: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
        "number.base": "Stok harus berupa angka",
        "number.integer": "Stok harus berupa bilangan bulat",
        "number.min": "Stok tidak boleh kurang dari 0",
        "any.required": "Stok wajib diisi"
    })
});

module.exports = {
    createVarianSchema,
    updateVarianSchema,
    updateStockSchema
};