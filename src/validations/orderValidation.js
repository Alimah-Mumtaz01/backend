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

const recipientNameSchema = Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
        'string.empty': 'Nama penerima harus diisi',
        'string.min': 'Nama penerima minimal 3 karakter',
        'string.max': 'Nama penerima maksimal 100 karakter',
        'any.required': 'Nama penerima harus diisi'
    });

const recipientPhoneSchema = Joi.string()
    .pattern(/^[0-9+]{10,20}$/)
    .required()
    .messages({
        'string.pattern.base': 'Nomor HP harus terdiri dari 10-20 angka atau tanda +',
        'string.empty': 'Nomor HP penerima harus diisi',
        'any.required': 'Nomor HP penerima harus diisi'
    });

const deliveryAddressSchema = Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required()
    .messages({
        'string.empty': 'Alamat pengiriman harus diisi',
        'string.min': 'Alamat pengiriman minimal 10 karakter',
        'string.max': 'Alamat pengiriman maksimal 500 karakter',
        'any.required': 'Alamat pengiriman harus diisi'
    });

const addressSourceSchema = Joi.when('tipe_pengiriman', {
    is: 'delivery',
    then: Joi.string()
        .valid('profile', 'custom')
        .required()
        .messages({
            'any.only': 'Sumber alamat harus profile atau custom',
            'any.required': 'Sumber alamat pengiriman harus dipilih'
        }),
    otherwise: Joi.string().allow('', null)
});

const recipientNameConditionalSchema = Joi.when('address_source', {
    is: 'custom',
    then: recipientNameSchema,
    otherwise: Joi.string().allow('', null)
});

const recipientPhoneConditionalSchema = Joi.when('address_source', {
    is: 'custom',
    then: recipientPhoneSchema,
    otherwise: Joi.string().allow('', null)
});

const deliveryAddressConditionalSchema = Joi.when('address_source', {
    is: 'custom',
    then: deliveryAddressSchema,
    otherwise: Joi.string()
        .allow('', null)
        .max(500)
        .messages({
            'string.max': 'Alamat pengiriman maksimal 500 karakter'
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

    address_source: addressSourceSchema,

    nama_penerima: recipientNameConditionalSchema,

    no_hp_penerima: recipientPhoneConditionalSchema,

    alamat_pengiriman: deliveryAddressConditionalSchema,

    catatan_alamat_pengiriman: Joi.string()
        .trim()
        .allow('', null)
        .max(500)
        .messages({
            'string.max': 'Catatan alamat pengiriman maksimal 500 karakter'
        }),

    catatan: Joi.string()
        .max(1000)
        .allow('', null)
        .messages({
            'string.max': 'Catatan maksimal 1000 karakter'
        }),

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

    address_source: addressSourceSchema,

    nama_penerima: recipientNameConditionalSchema,

    no_hp_penerima: recipientPhoneConditionalSchema,

    alamat_pengiriman: deliveryAddressConditionalSchema,

    catatan_alamat_pengiriman: Joi.string()
        .trim()
        .allow('', null)
        .max(500)
        .messages({
            'string.max': 'Catatan alamat pengiriman maksimal 500 karakter'
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