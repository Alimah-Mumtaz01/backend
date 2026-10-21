const Joi = require('joi');

const checkoutItemVariantSchema = Joi.object({
    id_varian: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'id_varian harus berupa angka',
            'number.integer': 'id_varian harus berupa bilangan bulat',
            'number.positive': 'id_varian tidak valid',
            'any.required': 'id_varian harus diisi'
        }),
    jumlah: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'jumlah harus berupa angka',
            'number.integer': 'jumlah harus berupa bilangan bulat',
            'number.positive': 'jumlah harus lebih dari 0',
            'any.required': 'jumlah harus diisi'
        })
});

const checkoutItemSchema = Joi.object({
    id_product: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'id_product harus berupa angka',
            'number.integer': 'id_product harus berupa bilangan bulat',
            'number.positive': 'id_product tidak valid',
            'any.required': 'id_product harus diisi'
        }),
    quantity: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'quantity harus berupa angka',
            'number.integer': 'quantity harus berupa bilangan bulat',
            'number.positive': 'quantity harus lebih dari 0',
            'any.required': 'quantity harus diisi'
        }),
    variants: Joi.array()
        .items(checkoutItemVariantSchema)
        .min(1)
        .required()
        .messages({
            'array.base': 'variants harus berupa array',
            'array.min': 'Minimal pilih satu varian',
            'any.required': 'Varian harus diisi'
        })
});

const checkoutSchema = Joi.object({
    tipe_pengiriman: Joi.string()
        .valid('delivery', 'pickup')
        .required()
        .messages({
            'any.only': 'Tipe pengiriman harus delivery atau pickup',
            'any.required': 'Tipe pengiriman harus diisi'
        }),
    alamat_pengiriman: Joi.when('tipe_pengiriman', {
        is: 'delivery',
        then: Joi.string()
            .trim()
            .min(1)
            .max(500)
            .required()
            .messages({
                'string.empty': 'Alamat pengiriman harus diisi untuk tipe delivery',
                'any.required': 'Alamat pengiriman harus diisi untuk tipe delivery',
                'string.max': 'Alamat pengiriman maksimal 500 karakter'
            }),
        otherwise: Joi.string()
            .allow('', null)
            .max(500)
            .messages({
                'string.max': 'Alamat pengiriman maksimal 500 karakter'
            })
    }),
    catatan: Joi.string()
        .allow('', null)
        .max(1000)
        .messages({
            'string.max': 'Catatan maksimal 1000 karakter'
        }),
    items: Joi.array()
        .items(checkoutItemSchema)
        .min(1)
        .required()
        .messages({
            'array.base': 'items harus berupa array',
            'array.min': 'Minimal harus ada satu produk dalam pesanan',
            'any.required': 'Item pesanan harus diisi'
        })
});

module.exports = { checkoutSchema };
