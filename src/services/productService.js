const {Product, sequelize} = require("../models");

const getAllProducts = async () => {
    try {
        const products = await Product.findAll({
            order: [["id_product", "ASC"]],
        });
        return products;
    } catch (error) {
        throw error;
    }
};

const getProductById = async (id_product) => {
    try {
        const product = await Product.findByPk(id_product);
        if (!product) {
            const error = new Error("Produk tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        return product;
    } catch (error) {
        throw error;
    }
};

const createProduct = async (productData) => {
    const transaction = await sequelize.transaction();
    try {
        const product = await Product.create(productData, {
            transaction,
        });
        await transaction.commit();
        return product;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateProduct = async (id_product, productData) => {
    const transaction = await sequelize.transaction();
    try {
        const product = await Product.findByPk(id_product, {
            transaction,
        });
        if (!product) {
            const error = new Error ("Product tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        await product.update(productData, {
            transaction,
        });
        await transaction.commit();
        return product;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deleteProduct = async (id_product) => {
    const transaction = await sequelize.transaction();
    try {
        const product = await Product.findByPk(id_product, {
            transaction,
        });
        if (!product) {
            const error = new Error ("Product tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        await product.destroy({
            transaction,
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}