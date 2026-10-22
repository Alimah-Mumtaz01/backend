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
            'array.base': 'variants harus berupa array',
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
        .max(1000)
        .allow('', null),

    items: Joi.array()
        .items(orderItemSchema)
        .min(1)
        .required()
        .messages({
            'array.base': 'items harus berupa array',
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
    })
});

const updateOrderStatusSchema = Joi.object({
    status_order: Joi.string()
        .valid(
            'menunggu_konfirmasi',
            'pesanan_diterima',
            'menunggu_pembayaran',
            'pembayaran_diperiksa',
            'pembayaran_ditolak',
            'dibatalkan',
            'diproses',
            'siap_diambil',
            'sedang_dikirim',
            'selesai'
        )
        .required()
        .messages({
            'any.only': 'Status order tidak valid',
            'any.required': 'Status order wajib diisi',
            'string.empty': 'Status order wajib diisi'
        })
});

module.exports = {
    createOrderSchema,
    updateShippingSchema,
    updateOrderStatusSchema
};