const { Varian, sequelize } = require("../models");

const getAllVarians = async () => {
    try {
        const varian = await Varian.findAll({
            order: [["id_varian", "ASC"]],
        });
        return varian;
    } catch (error) {
        throw error;
    }
};

const getVarianById = async (id_varian) => {
    try {
        const varian = await Varian.findByPk(id_varian);
        if (!varian) {
            const error = new Error("Varian tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        return varian;
    } catch (error) {
        throw error;
    }
};

const createVarian = async (varianData) => {
    const transaction = await sequelize.transaction();
    try {
        const existingVarian = await Varian.findOne({
            where: {
                nama_varian: varianData.nama_varian,
            },
            transaction,
        });
        if (existingVarian) {
            const error = new Error("Nama varian sudah ada");
            error.statusCode = 400;
            throw error;
        }
        const varian = await Varian.create(varianData, { transaction });
        await transaction.commit();
        return varian;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateVarian = async (id_varian, varianData) => {
    const transaction = await sequelize.transaction();
    try {
        const varian = await Varian.findByPk(id_varian, { transaction });
        if (!varian) {
            const error = new Error("Varian tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        if (varianData.nama_varian && varianData.nama_varian !== varian.nama_varian) {
            const existingVarian = await Varian.findOne({
                where: {
                    nama_varian: varianData.nama_varian,
                },
                transaction,
            });
            if (existingVarian) {
                const error = new Error("Nama varian sudah ada");
                error.statusCode = 409;
                throw error;
            }
        }
        await varian.update(varianData, { transaction });
        await transaction.commit();
        return varian;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateStock = async (id_varian, stok) => {
    const transaction = await sequelize.transaction();
    try {
        const varian = await Varian.findByPk(id_varian, { transaction });
        if (!varian) {
            const error = new Error("Varian tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        await varian.update({ stok }, { transaction });
        await transaction.commit();
        return varian;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deleteVarian = async (id_varian) => {
    const transaction = await sequelize.transaction();
    try {
        const varian = await Varian.findByPk(id_varian, { transaction });
        if (!varian) {
            const error = new Error("Varian tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
        await varian.destroy({ transaction });
        await transaction.commit();
        return varian;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getAllVarians,
    getVarianById,
    createVarian,
    updateVarian,
    updateStock,
    deleteVarian,
};