const express = require('express');
const varianController = require('../controllers/varianController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createVarianSchema, updateVarianSchema } = require('../validations/varianValidation');
const router = express.Router();

router.get('/', varianController.getAllVarians);
router.get('/:id_varian', varianController.getVarianById);
router.post('/', authMiddleware, authorize('admin'), validate(createVarianSchema), varianController.createVarian);
router.put('/:id_varian', authMiddleware, authorize('admin'), validate(updateVarianSchema), varianController.updateVarian);
router.patch('/:id_varian/stok', authMiddleware, authorize('admin'), validate(updateVarianSchema), varianController.updateStock);
router.delete('/:id_varian', authMiddleware, authorize('admin'), varianController.deleteVarian);

module.exports = router;