const Joi = require('joi');

const orderItemVariantSchema = Joi.object({
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
            'number.positive': 'jumlah tidak valid',
            'any.required': 'jumlah harus diisi'
        })
});

const orderItemSchema = Joi.object({
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
            'number.positive': 'quantity tidak valid',
            'any.required': 'quantity harus diisi'
        }),

    variants: Joi.array()
        .items(orderItemVariantSchema)
        .min(1)
        .required()
        .messages({
            'array.min': 'Minimal pilih satu variant',
            'any.required': 'Variant harus diisi'
        })
});

const createOrderSchema = Joi.object({
    tipe_pengiriman: Joi.string()
        .valid('delivery', 'pickup')
        .required()
        .messages({
            'any.only': 'Tipe pengiriman harus delivery atau pickup',
            'any.required': 'Tipe pengiriman harus diisi'
        }),

    alamat_pengiriman: Joi.string()
        .max(500)
        .allow('', null),

    catatan: Joi.string()
        .max(1000)
        .allow('', null),

    items: Joi.array()
        .items(orderItemSchema)
        .min(1)
        .required()
        .messages({
            'array.min': 'Keranjang tidak boleh kosong',
            'any.required': 'Item order harus diisi'
        })
});

const updateShippingSchema = Joi.object({
    tipe_pengiriman: Joi.string()
        .valid('delivery', 'pickup')
        .required()
        .messages({
            'any.only': 'Tipe pengiriman harus delivery atau pickup',
            'any.required': 'Tipe pengiriman harus diisi'
        }),
        
    alamat_pengiriman: Joi.string()
        .max(500)
        .allow('', null)
});

module.exports = {
    createOrderSchema,
    updateShippingSchema
};