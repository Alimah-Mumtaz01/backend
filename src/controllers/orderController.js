const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
    try {
        const id_user = req.user.id_user;
        const order = await orderService.createOrder(id_user, req.body);
        return res.status(201).json({
            success: true,
            message: 'Order berhasil dibuat',
            data: order,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const id_user = req.user.id_user;
        const orders = await orderService.getOrdersByUser(id_user);
        return res.status(200).json({
            success: true,
            message: 'Data order berhasil diambil',
            data: orders,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
};

const getMyOrderById = async (req, res) => {
    try {
        const id_user = req.user.id_user;
        const { id_order } = req.params;
        const order = await orderService.getOrderById(id_order, id_user);
        return res.status(200).json({
            success: true,
            message: 'Data order berhasil diambil',
            data: order,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
};

const updateShipping = async (req, res) => {
    try {
        const { id_order } = req.params;
        const id_user = req.user.id_user;
        const result = await orderService.updateShipping(id_order, id_user, req.body);
        return res.status(200).json({
            success: true,
            message: 'Data pengiriman berhasil diperbarui',
            data: result
        });
    } catch (error) {
        console.error('Update shipping error:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getMyOrderById,
    updateShipping
};