const express = require('express');
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController')
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware')
const { uploadPayment } = require('../middleware/uploadMiddleware')
const validate = require('../middleware/validateMiddleware');
const { createOrderSchema, updateShippingSchema } = require('../validations/orderValidation');
const router = express.Router();

router.post('/', authMiddleware, validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/my-orders/:id_order', authMiddleware, orderController.getMyOrderById);
router.put('/my-orders/:id_order/shipping', authMiddleware, validate(updateShippingSchema), orderController.updateShipping);
router.post('/:id_order/payment', authMiddleware, uploadPayment.single("bukti_pembayaran"), paymentController.uploadPayment);
router.put('/:id_order/payment/verify', authMiddleware, roleMiddleware("admin"), paymentController.verifyPayment);
router.put('/:id_order/status', authMiddleware, roleMiddleware("admin"), orderController.updateOrderStatus);
router.get('/my-orders/:id_order/status', authMiddleware, orderController.getMyOrderStatus);

module.exports = router;