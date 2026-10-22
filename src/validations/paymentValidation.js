const Joi = require('joi');

const uploadPaymentSchema = Joi.object({
    metode_pembayaran: Joi.string()
        .valid('transfer_bank', 'e-wallet')
        .required()
        .messages({
            'any.only': 'Metode pembayaran harus Transfer Bank atau E-Wallet',
            'any.required': 'Metode pembayaran harus diisi',
            'string.empty': 'Metode pembayaran harus diisi'
        })
});

const verifyPaymentSchema = Joi.object({
    status_payment: Joi.string()
        .valid('verified', 'rejected')
        .required()
        .messages({
            'any.only': 'Status pembayaran tidak valid',
            'any.required': 'Status pembayaran harus diisi',
            'string.empty': 'Status pembayaran harus diisi'
        }),
    catatan_verifikasi: Joi.when('status_payment', {
        is: 'rejected',
        then: Joi.string()
            .trim()
            .min(1)
            .required()
            .messages({
                'string.empty': 'Alasan penolakan pembayaran harus diisi',
                'any.required': 'Alasan penolakan pembayaran harus diisi'
            }),
        otherwise: Joi.string()
            .allow('', null)
    })
});

module.exports = {
    uploadPaymentSchema,
    verifyPaymentSchema
};
