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

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();

        return res.status(200).json({
            success: true,
            message: 'Seluruh data pesanan berhasil diambil',
            data: orders,
        });
    } catch (error) {
        console.error('Get all orders error:', error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
};

const getAdminOrderById = async (req, res) => {
    try {
        const { id_order } = req.params;

        const order = await orderService.getOrderDetailByIdAdmin(id_order);

        return res.status(200).json({
            success: true,
            message: 'Detail pesanan berhasil diambil',
            data: order,
        });
    } catch (error) {
        console.error('Get admin order detail error:', error);

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

        const result = await orderService.updateShipping(
            id_order,
            id_user,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Data pengiriman berhasil diperbarui',
            data: result,
        });
    } catch (error) {
        console.error('Update shipping error:', error);

        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id_order } = req.params;
        const { status_order } = req.body;

        const order = await orderService.updateOrderStatus(
            id_order,
            status_order
        );

        return res.status(200).json({
            success: true,
            message: 'Status order berhasil diperbarui',
            data: order,
        });
    } catch (error) {
        console.error('Update order status error:', error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
};

const getMyOrderStatus = async (req, res) => {
    try {
        const { id_order } = req.params;
        const id_user = req.user.id_user;

        const order = await orderService.getOrderStatusByUser(
            id_order,
            id_user
        );

        return res.status(200).json({
            success: true,
            message: 'Status order berhasil diambil',
            data: order,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
};

const getCustomerOrderHistoryAdmin = async (req, res) => {
    try {
        const { id_user } = req.params;

        const customerId = Number(id_user);

        if (!Number.isInteger(customerId) || customerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID pelanggan tidak valid.",
            });
        }

        const data = await orderService.getCustomerOrderHistoryAdmin(
            customerId
        );

        return res.status(200).json({
            success: true,
            message: "Riwayat pesanan pelanggan berhasil diambil.",
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message ||
                "Gagal mengambil riwayat pesanan pelanggan.",
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getMyOrderById,
    getCustomerOrderHistoryAdmin,
    getAllOrders,
    getAdminOrderById,
    updateShipping,
    updateOrderStatus,
    getMyOrderStatus,
};
