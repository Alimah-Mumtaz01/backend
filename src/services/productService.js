const { Product, sequelize } = require("../models");

const getAllProducts = async () => {
    return await Product.findAll({
        order: [["id_product", "ASC"]]
    });
};

const getProductById = async (id_product) => {
    const product = await Product.findByPk(id_product);

    if (!product) {
        const error = new Error("Produk tidak ditemukan");
        error.statusCode = 404;
        throw error;
    }

    return product;
};

const createProduct = async (productData) => {
    const transaction = await sequelize.transaction();

    try {
        const product = await Product.create(productData, {
            transaction
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
            transaction
        });

        if (!product) {
            const error = new Error("Produk tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        await product.update(productData, {
            transaction
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
            transaction
        });

        if (!product) {
            const error = new Error("Produk tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }

        await product.destroy({
            transaction
        });

        await transaction.commit();

        return product;
    } catch (error) {
        await transaction.rollback();

        if (
            error.name === "SequelizeForeignKeyConstraintError"
        ) {
            const conflict = new Error(
                "Produk tidak dapat dihapus karena sudah digunakan dalam transaksi. Silakan ubah status produk menjadi nonaktif."
            );

            conflict.statusCode = 409;

            throw conflict;
        }

        throw error;
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};