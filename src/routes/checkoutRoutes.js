const express = require('express');
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:id_order', authMiddleware, checkoutController.getCheckout);

module.exports = router;