const checkoutService = require('../services/checkoutService');

const getCheckout = async (req, res) => {
    try {
        const {id_order} = req.params;
        const id_user = req.user.id_user;
        const checkout = await checkoutService.getCheckoutByOrderId(id_order, id_user);
        return res.status(200).json({
            success: true,
            message: 'Data checkout berhasil diambil',
            data: checkout
        });
    } catch (error) {
        console.error('GET CHECKOUT ERROR:', error);
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCheckout
};