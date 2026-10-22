const Joi = require('joi');

const createReviewSchema = Joi.object({
    id_order: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'id_order harus berupa angka',
            'number.integer': 'id_order harus berupa bilangan bulat',
            'number.positive': 'id_order tidak valid',
            'any.required': 'id_order harus diisi'
        }),
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
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': 'Rating harus berupa angka',
            'number.integer': 'Rating harus berupa bilangan bulat',
            'number.min': 'Rating minimal 1',
            'number.max': 'Rating maksimal 5',
            'any.required': 'Rating harus diisi'
        }),
    komentar: Joi.string()
        .allow('', null)
});

const updateReviewSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': 'Rating harus berupa angka',
            'number.integer': 'Rating harus berupa bilangan bulat',
            'number.min': 'Rating minimal 1',
            'number.max': 'Rating maksimal 5',
            'any.required': 'Rating harus diisi'
        }),
    komentar: Joi.string()
        .allow('', null)
});

module.exports = {
    createReviewSchema,
    updateReviewSchema
};
