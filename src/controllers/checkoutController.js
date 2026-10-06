const checkoutService = require('../services/checkoutService');

const previewCheckout = async (req, res) => {
    try {
        const checkout = await checkoutService.previewCheckout(req.body);
        return res.status(200).json({
            success: true,
            message: 'Checkout berhasil dihitung',
            data: checkout
        });
    } catch (error) {
        console.error('PREVIEW CHECKOUT ERROR:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    previewCheckout
};