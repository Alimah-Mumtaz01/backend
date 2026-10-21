const express = require('express');
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { checkoutSchema } = require('../validations/checkoutValidation');
const router = express.Router();

router.post('/preview', authMiddleware, validate(checkoutSchema), checkoutController.previewCheckout);

module.exports = router;