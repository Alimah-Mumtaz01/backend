const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createOrderSchema } = require('../validations/orderValidation');
const router = express.Router();

router.post('/', authMiddleware, validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/my-orders/:id_order', authMiddleware, orderController.getMyOrderById);

module.exports = router;