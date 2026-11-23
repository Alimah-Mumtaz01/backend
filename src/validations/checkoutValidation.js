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

    address_source: Joi.when('tipe_pengiriman', {
        is: 'delivery',
        then: Joi.string()
            .valid('profile', 'custom')
            .required()
            .messages({
                'any.only': 'Sumber alamat harus profile atau custom',
                'any.required': 'Sumber alamat pengiriman harus dipilih'
            }),
        otherwise: Joi.string()
            .allow('', null)
    }),

    nama_penerima: Joi.when('address_source', {
        is: 'custom',
        then: Joi.string()
            .trim()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Nama penerima harus diisi',
                'string.min': 'Nama penerima minimal 3 karakter',
                'string.max': 'Nama penerima maksimal 100 karakter',
                'any.required': 'Nama penerima harus diisi'
            }),
        otherwise: Joi.string().allow('', null)
    }),

    no_hp_penerima: Joi.when('address_source', {
        is: 'custom',
        then: Joi.string()
            .pattern(/^[0-9+]{10,20}$/)
            .required()
            .messages({
                'string.pattern.base': 'Nomor HP harus terdiri dari 10-20 angka atau tanda +',
                'string.empty': 'Nomor HP penerima harus diisi',
                'any.required': 'Nomor HP penerima harus diisi'
            }),
        otherwise: Joi.string().allow('', null)
    }),

    alamat_pengiriman: Joi.when('address_source', {
        is: 'custom',
        then: Joi.string()
            .trim()
            .min(10)
            .max(500)
            .required()
            .messages({
                'string.empty': 'Alamat pengiriman harus diisi',
                'string.min': 'Alamat pengiriman minimal 10 karakter',
                'string.max': 'Alamat pengiriman maksimal 500 karakter',
                'any.required': 'Alamat pengiriman harus diisi'
            }),
        otherwise: Joi.string()
            .allow('', null)
            .max(500)
            .messages({
                'string.max': 'Alamat pengiriman maksimal 500 karakter'
            })
    }),

    catatan_alamat_pengiriman: Joi.string()
        .trim()
        .allow('', null)
        .max(500)
        .messages({
            'string.max': 'Catatan alamat pengiriman maksimal 500 karakter'
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